import LoginPage from '@/LoginPage.vue'
import MainPage from '@/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginPage },
    { path: '/main', component: MainPage },
  ],
})

export default router
