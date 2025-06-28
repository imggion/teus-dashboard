<template>
  <div class="min-h-screen bg-[#121212] flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="flex-1 ml-16">
      <!-- Header -->
      <header
        class="bg-[#121212] border-b border-gray-800 px-8 py-4 flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <h1 class="text-white text-2xl font-semibold">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Notification Bell -->
          <!-- TODO: Notification system -> in the future -->
          <!-- <button class="relative p-2 text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >1</span
            >
          </button> -->
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()

const pageTitle = computed(() => {
  switch (route.name) {
    case 'home':
      return 'Overview'
    case 'services':
      return 'Services'
    default:
      return 'Teus Dashboard'
  }
})
</script>
