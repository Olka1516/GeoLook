<template>
  <aside class="sidebar">
    <section class="list" v-if="mode === 'list'">
      <InputText type="text" v-model="searchQuery" placeholder="Введіть назву країни" />

      <div class="cards">
        <BaseCityCard
          v-for="city in filteredCountries"
          :key="city.place_id"
          :city
          @click="selectCity(city.place_id)"
        />
      </div>
    </section>
    <section class="details" v-else>
      <div class="content">
        <h3>{{ store.townsDetails[countryId].localname }}</h3>
        <p>{{ store.townsDetails[countryId].category }}</p>
        <p>{{ store.townsDetails[countryId].type }}</p>
        <p>{{ store.townsDetails[countryId].country_code }}</p>
      </div>

      <BaseButton rounded icon="pi pi-arrow-left" severity="info" @click="back" variant="text" />
    </section>
  </aside>
</template>

<script setup lang="ts">
import { nominatimStore } from '@/stores'
import { ref, computed, onMounted, type Ref, watch } from 'vue'
import BaseCityCard from './BaseCityCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { ENDPOINTS } from '@/constants/endpoints'

const store = nominatimStore()
const searchQuery = ref('')
const countries: Ref<{ display_name: string }[]> = ref(store.towns || [])
const route = useRoute()
const router = useRouter()

const countryId = ref(route.params.id || null)
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
    countryId.value = newId || null
    mode.value = newId ? 'details' : 'list'
  },
)
</script>

<style scoped>
.sidebar {
  background-color: #f5f5f5;
  padding: 18px;
  height: 100vh;
  width: 100%;
}

.p-inputtext {
  width: 100%;
}

.content {
  width: 100%;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.details {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-end;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 36px - 24px - 36px);
  padding-right: 8px;
  overflow: hidden;
  overflow-y: auto;
}
</style>
