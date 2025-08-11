import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'
import Aura from '@primeuix/themes/aura'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'primeicons/primeicons.css'
import 'leaflet/dist/leaflet.css'
import './index.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(pinia)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false || 'none',
      },
    },
  })
  .mount('#app')
app.component('InputText', InputText)
app.component('BaseButton', Button)
