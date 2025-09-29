import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
    {
      path: '/country/:id',
      name: 'countryDetails',
      component: () => import('@/views/HomePage.vue'),
    },
  ],
})

export default router
