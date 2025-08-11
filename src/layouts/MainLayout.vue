<template>
  <div class="container">
    <BaseSidebar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import BaseSidebar from '@/components/BaseSidebar.vue'
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1.2fr 4fr;
}
</style>
