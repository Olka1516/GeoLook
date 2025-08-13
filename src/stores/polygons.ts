import { defineStore } from 'pinia'
import { reactive, toRefs, type Reactive } from 'vue'
import polygonsExample from '@/constants/polygons.json'

export const polygonsStore = defineStore('polygons', () => {
  const state: Reactive<{ polygons: number[][][]; colors: string[] }> = reactive({
    polygons: [],
    colors: [],
  })

  const getPolygons = () => {
    if (state.polygons.length) return
    polygonsExample.forEach((element, i) => {
      element.polygon.forEach((cord) => {
        if (!state.polygons[i]) state.polygons[i] = []
        state.polygons[i].push([cord.lat, cord.lng])
      })
    })
    generateUniqueColors(polygonsExample.length)
  }

  const generateUniqueColors = (count: number) => {
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((360 / count) * i)
      state.colors.push(`hsl(${hue}, 70%, 50%)`)
    }
  }
  return { ...toRefs(state), getPolygons }
})
