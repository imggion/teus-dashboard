<script setup lang="ts">
import HomeLayout from '@/layouts/HomeLayout.vue'
import HeaderLogo from '@/components/HeaderLogo.vue'
import Navbar from '@/components/navbar/Navbar.vue'
import ServiceTabs from '@/components/services/ServiceTabs.vue'
</script>

<template>
  <main>
    <HomeLayout>
      <Navbar />
      <div class="bg-[#121212] text-white flex flex-col items-center justify-center p-5">
        <HeaderLogo text="Services Management" class="mb-10" />

        <div class="w-full max-w-7xl">
          <div
            class="bg-[#1e1e1e] bg-opacity-50 backdrop-blur-lg p-4 rounded-3xl shadow-xl border border-white/5 transition-transform duration-300"
          >
            <ServiceTabs />
          </div>
        </div>
      </div>
    </HomeLayout>
  </main>
</template>
