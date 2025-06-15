<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout.vue'
import HeaderLogo from '@/components/HeaderLogo.vue'
import { Icon } from '@iconify/vue'
import { Icons } from '@/configs/Icons'
import LoginInfoModal from '@/components/modals/LoginInfoModal.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { authServices, type LoginPayload } from '@/services/AuthServices'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components/generics/ErrorMessage.vue'
import { configServices } from '@/services/ConfigServices'
import { TeusKey } from '@/types/Config'

const router = useRouter()
const isLoading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref('')
const showHelpLoginModal = ref(false)
const authStore = useAuthStore()

const handleShowHelpLoginModal = () => {
  showHelpLoginModal.value = !showHelpLoginModal.value
}

const form = reactive({
  username: '',
  password: '',
})

const validateForm = () => {
  if (!form.username.trim()) {
    errorMessage.value = 'Username is required'
    return false
  }

  if (!form.password.trim()) {
    errorMessage.value = 'Password is required'
    return false
  }

  return true
}

const { data: isFirstLogin, refetch: refetchIsFirstLogin } = useQuery({
  queryKey: [TeusKey.isFirstVisit],
  queryFn: configServices.isFirstLogin,
  enabled: false,
})

const { mutate: login } = useMutation({
  mutationFn: authServices.login,
  onSuccess: (data) => {
    console.log(data)
    authStore.setToken(data.access)
    router.push('/')
  },
  onError: (error: any) => {
    isLoading.value = false
    errorMessage.value = error.response.data.message || 'An error occurred during login'
  },
})

const onSubmit = () => {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  const payload: LoginPayload = {
    username: form.username,
    password: form.password,
  }

  login(payload)
}

onBeforeMount(() => {
  refetchIsFirstLogin()
    .then((response) => {
      if (response.data?.first_visit) {
        authStore.setFirstLogin(response.data.first_visit)
        router.push('/register')
      }
    })
    .catch((error) => {
      console.error('Error fetching first login status:', error)
    })
})

// const handleSubmit = async () => {
//   errorMessage.value = ''

//   if (!validateForm()) {
//     return
//   }

//   isLoading.value = true

//   try {
//     // Simulate API call with setTimeout
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // This would be replaced with actual authentication logic
//     if (form.username === 'admin' && form.password === 'password') {
//       localStorage.setItem('isAuthenticated', 'true')
//       router.push('/')
//     } else {
//       throw new Error('Invalid credentials')
//     }
//   } catch (error) {
//     errorMessage.value = error instanceof Error ? error.message : 'Authentication failed'
//   } finally {
//     isLoading.value = false
//   }
// }

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <main>
    <HomeLayout>
      <div
        class="min-h-[100dvh] bg-[#121212] text-white flex flex-col items-center justify-center p-6"
      >
        <div class="w-full max-w-md space-y-8">
          <!-- Logo -->
          <div class="flex flex-col items-center justify-center">
            <HeaderLogo text="Welcome to Teus" />
            <p class="mt-4 text-center text-gray-400">Sign in to your account to continue</p>
          </div>

          <!-- Login Card -->
          <div
            class="bg-[#1e1e1e] bg-opacity-70 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-gray-700/30 transition-all duration-300 space-y-6"
          >
            <!-- Error Message -->
            <ErrorMessage v-if="errorMessage" :error-message="errorMessage" />

            <form @submit.prevent="onSubmit" class="space-y-5">
              <!-- Username Field -->
              <div>
                <label for="username" class="block text-sm font-medium text-gray-300 mb-2"
                  >Username</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
                  >
                    <Icon class="h-5 w-5" :icon="Icons.userSquare" />
                  </div>
                  <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    autocomplete="username"
                    required
                    class="w-full pl-10 pr-3 py-2.5 bg-[#2a2a2a] border border-gray-700/50 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <!-- Password Field -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2"
                  >Password</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
                  >
                    <Icon :icon="Icons.lockKey" />
                  </div>
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    class="w-full pl-10 pr-10 py-2.5 bg-[#2a2a2a] border border-gray-700/50 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
                    placeholder="Enter your password"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      @click="togglePasswordVisibility"
                      class="text-gray-400 hover:text-gray-300 focus:outline-none"
                    >
                      <Icon v-if="showPassword" :icon="Icons.viewOff" />
                      <Icon v-else :icon="Icons.eye" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Remember Me and Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="text-sm">
                  <button
                    @click="handleShowHelpLoginModal"
                    type="button"
                    class="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  v-ripple
                  :disabled="isLoading"
                  class="w-full relative py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span v-if="isLoading" class="flex items-center justify-center">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                  <div v-else class="flex flex-row justify-center gap-2">
                    <span>Sign in</span>
                    <Icon class="h-5 w-5" :icon="Icons.flyingHuman" />
                  </div>
                </button>
              </div>
            </form>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center">
            <p class="text-sm text-gray-400">
              Don't know how to login?
              <a href="#" class="text-purple-400 hover:text-purple-300 transition-colors"
                >Click Here</a
              >
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  </main>
  <LoginInfoModal @close="handleShowHelpLoginModal" :is-open="showHelpLoginModal" />
</template>

<style scoped>
.button-ripple {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
