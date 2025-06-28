<template>
  <div
    class="sidebar bg-[#0f0f0f] border-r border-gray-800 h-screen w-16 flex flex-col items-center py-4 fixed left-0 top-0 z-50"
  >
    <!-- Logo -->
    <div class="mb-8">
      <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
        <img src="/img/teus-logo.jpg" alt="Logo" class="rounded-lg" />
      </div>
    </div>

    <!-- Navigation Items -->
    <nav class="flex-1 flex flex-col items-center space-y-4">
      <router-link
        to="/"
        class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
        :class="{ 'bg-white text-black': $route.name === 'home' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </router-link>

      <router-link
        to="/services"
        class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
        :class="{ 'bg-white text-black': $route.name === 'services' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </router-link>
    </nav>

    <!-- User Avatar with Popover -->
    <div class="mt-auto relative">
      <button
        @click="showUserMenu = !showUserMenu"
        class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200"
      >
        <span class="text-white text-sm font-semibold">U</span>
      </button>

      <!-- User Menu Popover -->
      <div
        v-if="showUserMenu"
        class="absolute bottom-full left-full ml-2 mb-2 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-lg py-2 min-w-[120px] z-50"
      >
        <button
          @click="handleLogout"
          class="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Backdrop to close menu when clicking outside -->
  <div v-if="showUserMenu" @click="showUserMenu = false" class="fixed inset-0 z-40"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
  router.push('/login')
}
</script>
