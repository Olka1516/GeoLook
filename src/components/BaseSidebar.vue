<template>
  <aside class="sidebar">
    <section class="list" v-if="mode === 'list'">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          type="text"
          v-model="searchQuery"
          placeholder="Введіть назву населеного пункту"
        />
      </IconField>
      <p class="loader-towns" v-if="store.towns.length < polygonStore.polygons.length">
        Loaded {{ store.towns.length }}/{{ polygonStore.polygons.length }}
      </p>

      <div class="cards">
        <BaseCityCard
          v-for="city in filteredCountries"
          :key="city.place_id"
          :city
          @click="selectCity(city.place_id)"
        />
      </div>
    </section>

    <section class="details" v-else-if="countryId && store.townsDetails[countryId]">
      <div class="main-content">
        <h3>
          <span class="id">{{ store.townsDetails[countryId].localname }}</span>
          ({{ store.townsDetails[countryId].place_id }})
        </h3>

        <div class="tags-content">
          <span class="tag">{{ store.townsDetails[countryId].category }}</span>
          <span class="tag">{{ store.townsDetails[countryId].type }}</span>
        </div>
        <Divider />
        <h3>Tags</h3>
        <BaseTagsTable :city="store.townsDetails[countryId]" />
      </div>
      <BaseButton rounded icon="pi pi-arrow-left" severity="info" @click="back" label="Back" />
    </section>
    <BaseLoader v-else />
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref, watch, inject } from 'vue'
import BaseCityCard from './BaseCityCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { ENDPOINTS } from '@/constants/endpoints'
import BaseTagsTable from './BaseTagsTable.vue'
import type { City, NominatimStore, PoligonStore } from '@/types'
import BaseLoader from './BaseLoader.vue'

const store = inject<NominatimStore>('nominatimStore')!
const polygonStore = inject<PoligonStore>('polygonsStore')!
const searchQuery = ref('')
const countries: Ref<City[]> = ref(store.towns || [])
const route = useRoute()
const router = useRouter()

const countryId = ref(route.params.id ? route.params.id.toString() : null)
const mode = ref(countryId.value ? 'details' : 'list')

const filteredCountries = computed(() => {
  if (!countries.value.length) return []
  const searchFiltered = countries.value.filter((country) =>
    country.display_name.split(', ')[0].toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  const uniqueByPlaceId = Array.from(
    new Map(searchFiltered.map((item) => [item.place_id, item])).values(),
  )

  return uniqueByPlaceId
})

const selectCity = async (placeId: number) => {
  await router.push(ENDPOINTS.GET_DETAILS(placeId))
}

const back = async () => {
  await router.push(ENDPOINTS.HOME)
}

onMounted(async () => {
  countries.value = store.towns
})

watch(
  () => route.params.id,
  (newId) => {
    countryId.value = newId ? newId.toString() : null
    mode.value = newId ? 'details' : 'list'
  },
)
</script>

<style scoped>
@import '@/styles/components/baseSidebar.css';
@import '@/styles/general/tags.css';
</style>
