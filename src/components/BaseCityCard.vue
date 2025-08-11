<template>
  <Card>
    <template #title>{{ props?.city.display_name.split(',')[0] }}</template>
    <template #content>
      <Divider />
      <div class="content">
        <p>
          {{ props?.city.category }}
        </p>
        <p>
          {{ props?.city.type }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Card, Divider } from 'primevue'

const props = defineProps<{
  city: {
    display_name: string
    type: string
    category: string
  }
}>()
</script>

<style scoped>
.p-card {
  cursor: pointer;
}
.content {
  display: flex;
  justify-content: space-between;
}
</style>
