<script setup lang="ts">
import HomeLayout from '@/layouts/HomeLayout.vue'
import HeaderLogo from '@/components/HeaderLogo.vue'
import ButtonGrid from '@/components/ButtonGrid.vue'
import ChartsContainer from '@/components/ChartsContainer.vue'
import Navbar from '@/components/navbar/Navbar.vue'
import SystemInfoCard from '@/components/SystemInfoCard.vue'
</script>

<template>
  <main>
    <HomeLayout>
      <Navbar />
      <div class="bg-[#121212] text-white flex flex-col items-center justify-center p-4">
        <HeaderLogo text="Welcome back" class="mb-10" />

        <div class="w-full max-w-7xl space-y-8">
          <!-- Services Grid -->
          <div
            class="bg-[#1e1e1e] bg-opacity-50 backdrop-blur-lg p-4 rounded-3xl shadow-xl border border-white/5 transition-all duration-500 opacity-0 translate-y-8 animate-slide-in-up hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/20"
            style="animation-delay: 0.4s"
          >
            <ButtonGrid />
          </div>

          <!-- System Information Card -->
          <div class="opacity-0 translate-y-8 animate-slide-in-up" style="animation-delay: 0.6s">
            <SystemInfoCard />
          </div>

          <!-- Charts Container -->
          <div class="opacity-0 translate-y-8 animate-slide-in-up" style="animation-delay: 0.8s">
            <ChartsContainer />
          </div>
        </div>
      </div>
    </HomeLayout>
  </main>
</template>

<style scoped>
@keyframes slide-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slide-in-up 0.8s ease-out forwards;
}
</style>
