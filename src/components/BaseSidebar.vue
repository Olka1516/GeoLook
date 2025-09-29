<template>
  <aside class="sidebar">
    <section class="list" v-if="mode === 'list'">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          type="text"
          v-model="searchQuery"
          placeholder="Введіть назву населеного пункту..."
        />
      </IconField>
      <p class="loader-towns" v-if="towns.length < polygonStore.polygons.length">
        Завантажено {{ towns.length }}/{{ polygonStore.polygons.length }}
      </p>

      <div
        v-if="filteredCountries.length"
        class="cards"
        :class="{ 'cards-small': towns.length < polygonStore.polygons.length }"
      >
        <BaseCityCard
          v-for="city in filteredCountries"
          :key="city.place_id"
          :city
          @click="changeUrl(ENDPOINTS.GET_DETAILS(city.place_id))"
        />
      </div>
      <div v-else class="cards"><p>Нічого не вдалося знайти</p></div>
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
        <h3>Теги</h3>
        <BaseTagsTable :city="store.townsDetails[countryId]" />
      </div>
      <BaseButton
        rounded
        icon="pi pi-arrow-left"
        severity="info"
        @click="changeUrl(ENDPOINTS.HOME)"
        label="Назад"
      />
    </section>
    <BaseLoader v-else />
  </aside>
</template>

<script setup lang="ts">
import { ENDPOINTS } from '@/constants/endpoints'
import type { NominatimStore, PoligonStore } from '@/types'
import { computed, inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCityCard from './BaseCityCard.vue'
import BaseLoader from './BaseLoader.vue'
import BaseTagsTable from './BaseTagsTable.vue'

const store = inject<NominatimStore>('nominatimStore')!
const polygonStore = inject<PoligonStore>('polygonsStore')!
const searchQuery = ref('')
const towns = computed(() => store.towns.value)

const route = useRoute()
const router = useRouter()

const countryId = ref(route.params.id ? route.params.id.toString() : null)
const mode = ref(countryId.value ? 'details' : 'list')

const filteredCountries = computed(() => {
  if (!towns.value.length) return []
  const searchFiltered = towns.value.filter((country) =>
    country.display_name
      .split(', ')[0]
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase().trim()),
  )

  const uniqueByPlaceId = Array.from(
    new Map(searchFiltered.map((item) => [item.place_id, item])).values(),
  )

  return uniqueByPlaceId
})

const changeUrl = async (url: string) => {
  await router.push(url)
}

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
