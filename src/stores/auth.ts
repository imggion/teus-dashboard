import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { TokenManager } from '@/managers/TokenManager'
import { authServices } from '@/services/AuthServices'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(null)
  const isAuthenticated = ref(TokenManager.getAccessToken() !== null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isFirstLogin = ref(true)

  // Computed properties
  const currentUser = computed(() => user.value)

  const setToken = (token: string) => {
    TokenManager.setAccessToken(token)
    isAuthenticated.value = true
  }

  const getToken = () => {
    return TokenManager.getAccessToken()
  }

  const setFirstLogin = (firstLogin: boolean) => {
    isFirstLogin.value = firstLogin
  }

  const getFirstLogin = () => {
    return isFirstLogin.value
  }

  const removeToken = () => {
    TokenManager.clearTokens()
    isAuthenticated.value = false
  }

  const logout = () => {
    user.value = null
    removeToken()
    router.push('/login')
  }

  const checkAuth = async () => {
    const isAuth = await authServices.isAuth()
    isAuthenticated.value = isAuth

    return isAuthenticated.value
  }

  // Initialize
  checkAuth()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    currentUser,
    setToken,
    getToken,
    removeToken,
    logout,
    checkAuth,
    setFirstLogin,
    getFirstLogin,
  }
})
