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
import { inject, onMounted, ref, type Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { CoordinatesType, IdType, NominatimStore, Poligon, PoligonStore } from '@/types'

const store = inject<NominatimStore>('nominatimStore')!
const polygonStore = inject<PoligonStore>('polygonsStore')!

const zoom = ref(6)
const resCenter: Ref<number[]> = ref([0, 0])

const poligons: Ref<Poligon> = ref([])
const route = useRoute()

const getCoordinates = (newPoligons: Poligon, newZoom: number) => {
  poligons.value = newPoligons
  const geoPolygons = newPoligons.map((coords) => polygon([coords]))
  const tempCenter = center(featureCollection(geoPolygons))
  setTimeout(() => {
    zoom.value = newZoom
    resCenter.value = [...tempCenter.geometry.coordinates]
  }, 300)
}

const loadMapData = async (id?: string) => {
  if (id) {
    const data = await store.getDetails(Number(id))
    const coords = data.geometry.coordinates
    console.log(data.geometry.coordinates)
    const newPoligons = coords.map((coords: CoordinatesType) =>
      coords.map(([lat, lng]: [lat: number, lng: number]) => [lng, lat]),
    )
    getCoordinates(newPoligons, 11)
  } else {
    polygonStore.getPolygons()
    getCoordinates(polygonStore.polygons, 6)
    await store.getTowns(poligons.value)
  }
}

onMounted(() => {
  loadMapData(route.params.id as IdType)
})

watch(
  () => route.params.id,
  (newId) => {
    loadMapData(newId as IdType)
  },
)
</script>

<style scoped></style>
