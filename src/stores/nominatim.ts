import { defineStore } from 'pinia'
import { getTownDetails, getTownsByСontours } from '@/services'
import { reactive, toRefs, type Reactive } from 'vue'
import { center, points } from '@turf/turf'
import { delay } from '@/utils'
import type { City, Poligon } from '@/types'
import { useToast } from 'primevue/usetoast'

export const nominatimStore = defineStore(
  'nominatim',
  () => {
    const toast = useToast()
    const state: Reactive<{
      towns: City[]
      townsDetails: { [key: string]: City }
      index: number
    }> = reactive({
      towns: [],
      townsDetails: {},
      date: new Date(),
      index: 0,
    })

    const getDataFromStorage = () => {
      const townsData = JSON.parse(localStorage.getItem('nominatim') || '{}')
      const now = new Date()
      const beforeDate = new Date(townsData.date)
      const twentyMinutes = 20 * 60 * 1000

      if (beforeDate && now.getTime() - beforeDate.getTime() < twentyMinutes) {
        return townsData
      } else {
        localStorage.removeItem('nominatim')
        return {}
      }
    }

    const getTowns = async (poligons: Poligon) => {
      const townsData = getDataFromStorage()
      const hasSameLength = state.towns.length === poligons.length
      const hasTownsData = Array.isArray(townsData.towns) && townsData.towns.length > 0
      const townsDataMatchesLength = hasTownsData && townsData.towns.length === poligons.length

      if (state.towns.length && hasSameLength) return
      if (hasTownsData && !townsDataMatchesLength) {
        state.towns = townsData.towns
      }

      const newIndex = state.towns ? state.towns.length : 0
      for (let i = newIndex; i < poligons.length; i++) {
        try {
          const features = points(poligons[i])
          const tempCenter = center(features)

          const data = await getTownsByСontours(
            tempCenter.geometry.coordinates[0],
            tempCenter.geometry.coordinates[1],
          )

          state.towns.push(data)
          state.index = state.towns.length
        } catch {
          toast.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Something is wrong with the server, please try again later.',
            life: 3000,
          })
          state.index = state.towns.length
          break
        }
        if (i < poligons.length - 1) {
          await delay(1500)
        }
      }
    }

    const getDetails = async (placeId: number) => {
      const townsData = getDataFromStorage()
      state.townsDetails = state.townsDetails || townsData.townsDetails || {}
      if (state.townsDetails && state.townsDetails[placeId]) return state.townsDetails[placeId]
      try {
        const data = await getTownDetails(placeId)
        state.townsDetails[placeId] = data
        return data
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Something is wrong with the server, please try again later.',
          life: 3000,
        })
      }
    }

    return { ...toRefs(state), getTowns, getDetails }
  },
  {
    persist: true,
  },
)
