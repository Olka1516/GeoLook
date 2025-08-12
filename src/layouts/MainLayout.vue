<template>
  <template v-if="!loading">
    <div class="container">
      <BaseSidebar />
      <main>
        <slot />
      </main>
    </div>
  </template>
  <template v-else>
    <BaseLoader />
  </template>
</template>

<script setup lang="ts">
import BaseSidebar from '@/components/BaseSidebar.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import { onMounted, ref } from 'vue'
const loading = ref(true)
onMounted(() => {
  loading.value = false
})
</script>

<style scoped>
@import '@/styles/layouts/main.css';
</style>
