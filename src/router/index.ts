import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    name: 'home',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const hasToken = !!userStore.token

  if (to.path === '/login') {
    if (hasToken) {
      userStore.token = ''
      userStore.userInfo = null
      localStorage.removeItem('auth_token')
    }
    next()
  }
  else if (!hasToken) {
    next({ path: '/login', replace: true })
  }
  else {
    next()
  }
})

export default router
