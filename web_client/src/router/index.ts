import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import ReplicationPage from '@/pages/ReplicationPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LoginPage },
    { path: '/main', component: MainPage },
    { path: '/replication', component: ReplicationPage },
  ],
})

export default router
