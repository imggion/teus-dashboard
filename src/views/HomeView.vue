<script setup lang="ts">
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import ButtonGrid from '@/components/ButtonGrid.vue'
import ChartsContainer from '@/components/ChartsContainer.vue'
import SystemInfoCard from '@/components/SystemInfoCard.vue'
import SystemResourceIndicators from '@/components/SystemResourceIndicators.vue'
import DockerVersionCard from '@/components/DockerVersionCard.vue'
</script>

<template>
  <SidebarLayout>
    <!-- Welcome Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-white mb-2">Welcome to Teus</h2>
      <p class="text-gray-400">Monitor your services and manage your system infrastructure</p>
    </div>

    <!-- System Resource Indicators -->
    <SystemResourceIndicators />

    <!-- Charts Container -->
    <ChartsContainer />

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Services Grid -->
      <div class="bg-[#1e1e1e] rounded-2xl p-5 border border-gray-800">
        <h3 class="text-xl font-semibold text-white mb-5">Quick Access</h3>
        <ButtonGrid />
      </div>

      <!-- System Information Card -->
      <SystemInfoCard />

      <!-- Docker Version Card -->
      <DockerVersionCard />
    </div>
  </SidebarLayout>
</template>
