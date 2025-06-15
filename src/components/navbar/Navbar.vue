<template>
  <div class="w-full mb-6">
    <nav class="flex items-center py-5 opacity-0 animate-fade-in">
      <!-- Left spacer -->
      <div class="flex-1"></div>

      <!-- Centered navigation links -->
      <div class="flex space-x-8">
        <RouterLink
          to="/"
          :class="[
            'text-white hover:text-purple-400 font-medium transition-all duration-300 relative group transform hover:scale-110 opacity-0 animate-fade-in-nav',
            $route.path === '/' ? 'text-purple-400' : '',
          ]"
          style="animation-delay: 0.1s"
        >
          Home
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"
            :class="$route.path === '/' ? 'w-full' : ''"
          ></span>
        </RouterLink>

        <RouterLink
          to="/services"
          :class="[
            'text-white hover:text-purple-400 font-medium transition-all duration-300 relative group transform hover:scale-110 opacity-0 animate-fade-in-nav',
            $route.path === '/services' ? 'text-purple-400' : '',
          ]"
          style="animation-delay: 0.2s"
        >
          Services
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"
            :class="$route.path === '/services' ? 'w-full' : ''"
          ></span>
        </RouterLink>
      </div>

      <!-- Right aligned logout button -->
      <div class="flex-1 flex justify-end mr-4">
        <button
          class="cursor-pointer text-white flex gap-2 hover:text-purple-400 font-medium transition-all duration-300 relative group transform hover:scale-105 opacity-0 animate-fade-in-nav bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10 hover:border-purple-400/30 hover:bg-purple-400/10"
          style="animation-delay: 0.3s"
          @click="handleLogout"
        >
          <span class="transition-transform duration-200 group-hover:translate-x-[-2px]"
            >Logout</span
          >
          <Icon
            :icon="Icons.logout"
            class="w-4 h-4 self-center transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useRoute, useRouter } from 'vue-router'
import { Icons } from '@/configs/Icons'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes fade-in-nav {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-fade-in-nav {
  opacity: 0;
  transform: translateY(-10px);
  animation: fade-in-nav 0.8s ease-out forwards;
}
</style>
