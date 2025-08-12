import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import ToastService from 'primevue/toastservice'
import Aura from '@primeuix/themes/aura'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Toast from 'primevue/toast'

import 'primeicons/primeicons.css'
import 'leaflet/dist/leaflet.css'
import './styles/index.css'
import { Divider } from 'primevue'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(pinia)
  .use(router)
  .use(ToastService)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .mount('#app')
app.component('InputText', InputText)
app.component('BaseButton', Button)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('Divider', Divider)
app.component('Toast', Toast)
