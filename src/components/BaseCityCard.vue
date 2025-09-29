<template>
  <Card>
    <template #title>{{ props?.city.display_name.split(',')[0] }}</template>
    <template #content>
      <Divider />
      <div class="tags-content">
        <span class="tag">
          {{ props?.city.category }}
        </span>
        <span class="tag">
          {{ props?.city.type }}
        </span>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { City } from '@/types'
import { Card } from 'primevue'

const props = defineProps<{
  city: City
}>()
</script>

<style scoped>
@import '@/styles/components/baseCityCard.css';
@import '@/styles/general/tags.css';
</style>
