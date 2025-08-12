import { defineStore } from 'pinia'
import { getTownDetails, getTownsByСontours } from '@/services'
import { reactive, toRefs, type Reactive } from 'vue'
import { center, points } from '@turf/turf'
import { delay } from '@/utils'
import type { City } from '@/types'

export const nominatimStore = defineStore(
  'nominatim',
  () => {
    const state: Reactive<{
      towns: City[]
      townsDetails: { [key: string]: City }
    }> = reactive({
      towns: [],
      townsDetails: {},
      date: new Date(),
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

    const getTowns = async (poligons: number[][][]) => {
      const townsData = getDataFromStorage()
      if (state.towns.length) return
      else if (townsData.towns && townsData.towns.length) {
        state.towns = townsData.towns
        return
      }

      for (let i = 0; i < poligons.length; i++) {
        try {
          const features = points(poligons[i])
          const tempCenter = center(features)

          const data = await getTownsByСontours(
            tempCenter.geometry.coordinates[0],
            tempCenter.geometry.coordinates[1],
          )

          state.towns.push(data)
        } catch {
          console.error('error in nominatim store')
        }
        if (i < poligons.length - 1) {
          await delay(1100)
        }
      }
    }

    const getDetails = async (placeId: number) => {
      const townsData = getDataFromStorage()
      state.townsDetails = townsData.townsDetails || {}
      if (state.townsDetails && state.townsDetails[placeId]) return state.townsDetails[placeId]

      const data = await getTownDetails(placeId)
      state.townsDetails[placeId] = data
      return data
    }

    return { ...toRefs(state), getTowns, getDetails }
  },
  {
    persist: true,
  },
)
