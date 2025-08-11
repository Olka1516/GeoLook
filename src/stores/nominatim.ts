import { defineStore } from 'pinia'
import { getTownDetails, getTownsByСontours } from '@/services'
import { reactive, toRefs, type Reactive } from 'vue'
import { center, points } from '@turf/turf'
import { delay } from '@/utils'

export const nominatimStore = defineStore(
  'nominatim',
  () => {
    const state: Reactive<{
      towns: { display_name: string }[]
      townsDetails: { [key: string]: { centroid: { coordinates: number[] } } }
    }> = reactive({
      towns: [],
      townsDetails: {},
    })

    const getTowns = async (poligons: number[][][]) => {
      const townsData = JSON.parse(localStorage.getItem('nominatim') || '{}')
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
          // TODO: create error in front
        }
        if (i < poligons.length - 1) {
          await delay(1100)
        }
      }
    }

    const getDetails = async (placeId: number) => {
      const townsData = JSON.parse(localStorage.getItem('nominatim') || '')
      state.townsDetails = townsData.townsDetails
      if (state.townsDetails[placeId]) return state.townsDetails[placeId]

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
