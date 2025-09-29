<template>
  <table class="info-table">
    <tr v-for="[key, value] in filteredCity.slice(0, 10)" :key="key">
      <td>{{ key }}</td>
      <td>{{ value }}</td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import type { City } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  city: City
}>()

const filteredCity = computed(() =>
  Object.entries(props.city).filter(([key, value]) => typeof value !== 'object' && key !== 'icon'),
)
</script>

<style scoped>
@import '@/styles/components/baseTable.css';
</style>
