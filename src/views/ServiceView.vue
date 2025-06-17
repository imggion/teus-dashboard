<script setup lang="ts">
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import ServiceTabs from '@/components/services/ServiceTabs.vue'
</script>

<template>
  <SidebarLayout>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-white mb-2">Services</h2>
      <p class="text-gray-400">Manage and monitor your Docker containers and system services</p>
    </div>

    <!-- Service Management Tabs -->
    <div class="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800">
      <ServiceTabs />
    </div>
  </SidebarLayout>
</template>
