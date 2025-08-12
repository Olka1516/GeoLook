<template>
  <div>
    <MainLayout>
      <BaseMapView></BaseMapView>
    </MainLayout>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import BaseMapView from '@/components/BaseMapView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { nominatimStore, polygonsStore } from '@/stores'
import type { Poligon } from '@/types'
import { storeToRefs } from 'pinia'
import { provide } from 'vue'

const store = nominatimStore()
const polygonStore = polygonsStore()

const getDetails = async (id: number) => {
  return await store.getDetails(Number(id))
}
const getPolygons = () => {
  polygonStore.getPolygons()
}
const getTowns = async (poligons: Poligon) => {
  await store.getTowns(poligons)
}

provide('nominatimStore', {
  towns: storeToRefs(store).towns,
  townsDetails: store.townsDetails,
  getDetails,
  getTowns,
})
provide('polygonsStore', {
  polygons: polygonStore.polygons,
  colors: polygonStore.colors,
  getPolygons,
})
</script>

<style scoped></style>
