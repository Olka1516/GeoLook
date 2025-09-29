<template>
  <LMap ref="mapRef" @ready="onMapReady">
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
import type { Geometry, IdType, NominatimStore, PoligonStore, Shape } from '@/types'
import { LMap, LPolygon, LPolyline, LTileLayer } from '@vue-leaflet/vue-leaflet'
import 'leaflet'
import type { Map as LeafletMap } from 'leaflet'
import L from 'leaflet'
import type { ComponentPublicInstance } from 'vue'
import { inject, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'

type LMapInstance = ComponentPublicInstance<{
  leafletObject: LeafletMap
}>

const store = inject<NominatimStore>('nominatimStore')!
const polygonStore = inject<PoligonStore>('polygonsStore')!

const shapes = ref<Shape[]>([])
const route = useRoute()
const mapRef = useTemplateRef<LMapInstance | null>('mapRef')
const mapIsReady = ref(false)

const normalizeGeometry = (geometry: Geometry) => {
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

const onMapReady = () => {
  mapIsReady.value = true
}

const onUpdateBounds = () => {
  if (!shapes.value.length || !mapRef.value?.leafletObject || !mapIsReady.value) {
    return
  }

  const bounds = L.latLngBounds([])

  shapes.value.forEach((shape) => {
    if (shape.coords.length > 0) {
      bounds.extend(shape.coords)
    }
  })

  if (bounds.isValid()) {
    mapRef.value.leafletObject.fitBounds(bounds, { padding: [0, 0] })
  }
}

const loadMapData = async (id?: string) => {
  if (id) {
    const data = await store.getDetails(Number(id))
    const normalized = normalizeGeometry(data.geometry)
    shapes.value = normalized
  } else {
    polygonStore.getPolygons()
    const polys = polygonStore.polygons.map((coords) => ({
      type: 'Polygon',
      coords,
    }))
    shapes.value = polys as Shape[]
    await store.getTowns(polygonStore.polygons)
  }
}

onMounted(() => {
  loadMapData(route.params.id as IdType)
})

watch([shapes, mapIsReady], onUpdateBounds)

watch(
  () => route.params.id,
  (newId) => {
    loadMapData(newId as IdType)
  },
)
</script>
