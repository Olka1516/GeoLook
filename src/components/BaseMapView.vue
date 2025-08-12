<template>
  <LMap v-model:zoom="zoom" :center="resCenter">
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    />
    <template v-for="(item, i) in shapes" :key="i">
      <LPolygon
        v-if="item.type === 'Polygon'"
        :lat-lngs="item.coords"
        :color="polygonStore.colors[i % polygonStore.colors.length]"
        :fill="true"
        :fillOpacity="0.5"
        :fillColor="polygonStore.colors[i % polygonStore.colors.length]"
      />
      <LPolyline
        v-else-if="item.type === 'LineString'"
        :lat-lngs="item.coords"
        :color="polygonStore.colors[i % polygonStore.colors.length]"
      />
    </template>
  </LMap>
</template>

<script setup lang="ts">
import 'leaflet'
import { center, polygon, featureCollection, lineString } from '@turf/turf'
import { LMap, LTileLayer, LPolygon, LPolyline } from '@vue-leaflet/vue-leaflet'
import { inject, onMounted, ref, type Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Geometry, IdType, NominatimStore, PoligonStore, Shape } from '@/types'

const store = inject<NominatimStore>('nominatimStore')!
const polygonStore = inject<PoligonStore>('polygonsStore')!

const zoom = ref(6)
const resCenter: Ref<number[]> = ref([0, 0])

const shapes = ref<Shape[]>([])
const route = useRoute()

function normalizeGeometry(geometry: Geometry) {
  const result: Shape[] = []

  if (geometry.type === 'Polygon') {
    result.push({
      type: 'Polygon',
      coords: geometry.coordinates[0].map(([lat, lng]: [number, number]) => [lng, lat]),
    })
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((poly) => {
      result.push({
        type: 'Polygon',
        coords: poly[0].map(([lat, lng]: [number, number]) => [lng, lat]),
      })
    })
  } else if (geometry.type === 'LineString') {
    result.push({
      type: 'LineString',
      coords: geometry.coordinates.map(([lat, lng]: [number, number]) => [lng, lat]),
    })
  }

  return result
}

const getCoordinates = (items: Shape[], newZoom: number) => {
  shapes.value = items

  const polygons = shapes.value.filter((p) => p.type === 'Polygon').map((p) => polygon([p.coords]))
  const lines = shapes.value.filter((p) => p.type === 'LineString').map((p) => lineString(p.coords))

  let centerPolygons
  if (polygons.length) {
    centerPolygons = center(featureCollection(polygons))
  }

  let centerLines
  if (lines.length) {
    centerLines = center(featureCollection(lines))
  }

  let finalCenter: number[]
  if (centerPolygons && centerLines) {
    finalCenter = [
      (centerPolygons.geometry.coordinates[0] + centerLines.geometry.coordinates[0]) / 2,
      (centerPolygons.geometry.coordinates[1] + centerLines.geometry.coordinates[1]) / 2,
    ]
  } else if (centerPolygons) {
    finalCenter = centerPolygons.geometry.coordinates
  } else if (centerLines) {
    finalCenter = centerLines.geometry.coordinates
  } else {
    finalCenter = [0, 0]
  }

  setTimeout(() => {
    zoom.value = newZoom
    resCenter.value = [...finalCenter]
  }, 300)
}

const loadMapData = async (id?: string) => {
  if (id) {
    const data = await store.getDetails(Number(id))
    const normalized = normalizeGeometry(data.geometry)
    getCoordinates(normalized, 11)
  } else {
    polygonStore.getPolygons()
    const polys = polygonStore.polygons.map((coords) => ({
      type: 'Polygon',
      coords,
    }))
    getCoordinates(polys as Shape[], 6)
    await store.getTowns(polygonStore.polygons)
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
