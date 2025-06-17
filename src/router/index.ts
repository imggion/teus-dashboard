import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ServiceView from '../views/ServiceView.vue'
import LoginView from '../views/LoginView.vue'
import ContainerDetailView from '../views/ContainerDetailView.vue'
import { useAuthStore } from '@/stores/auth'
import SignupView from '@/views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: SignupView,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceView,
      meta: { requiresAuth: true },
    },
    {
      path: '/containers/:id',
      name: 'containerDetail',
      component: ContainerDetailView,
      meta: { requiresAuth: true },
    },
  ],
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true)
  const isAuthenticated = authStore.checkAuth()

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
