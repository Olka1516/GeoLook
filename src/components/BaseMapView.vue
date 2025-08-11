<template>
  <LMap v-model:zoom="zoom" :center="resCenter">
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    ></LTileLayer>
    <LPolygon
      v-for="(value, i) in poligons"
      :key="i"
      :lat-lngs="value"
      :color="polygonStore.colors[i]"
      :fill="true"
      :fillOpacity="0.5"
      :fillColor="polygonStore.colors[i]"
    />
  </LMap>
</template>

<script setup lang="ts">
import 'leaflet'
import { center, polygon, featureCollection } from '@turf/turf'
import { LMap, LTileLayer, LPolygon } from '@vue-leaflet/vue-leaflet'
import { onMounted, ref, type Ref, watch } from 'vue'
import { nominatimStore, polygonsStore } from '@/stores'
import { useRoute } from 'vue-router'

const store = nominatimStore()
const polygonStore = polygonsStore()
const zoom = ref(6)
const resCenter: Ref<number[]> = ref([0, 0])

const poligons: Ref<number[][][]> = ref([])
const route = useRoute()

const getCoordinates = (newPoligons: number[][][], newZoom: number) => {
  poligons.value = newPoligons
  const geoPolygons = newPoligons.map((coords) => polygon([coords]))
  const tempCenter = center(featureCollection(geoPolygons))
  zoom.value = newZoom
  setTimeout(() => {
    resCenter.value = [...tempCenter.geometry.coordinates]
  }, 300)
}

const loadMapData = async (id?: string) => {
  if (id) {
    const data = await store.getDetails(Number(id))
    const coords = data.geometry.coordinates
    const newPoligons = coords.map((coords) =>
      coords.map(([lat, lng]: [lat: number, lng: number]) => [lng, lat]),
    )
    getCoordinates(newPoligons, 10)
  } else {
    polygonStore.getPolygons()
    getCoordinates(polygonStore.polygons, 6)
    await store.getTowns(poligons.value)
  }
}

onMounted(() => {
  loadMapData(route.params.id as string | undefined)
})

watch(
  () => route.params.id,
  (newId) => {
    loadMapData(newId as string | undefined)
  },
)
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
