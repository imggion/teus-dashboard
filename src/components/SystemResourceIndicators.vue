<template>
  <div class="bg-[#1e1e1e] rounded-2xl border border-gray-700/30 p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- CPU Usage -->
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2-2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <p class="text-sm font-medium text-gray-400">CPU Usage</p>
            <span class="text-sm font-semibold text-gray-200">{{ cpuPercentage }}%</span>
          </div>
          <div class="w-full bg-gray-700/50 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-500 ease-out"
              :class="getCpuProgressColor(systemData?.cpu_usage || 0)"
              :style="{ width: `${cpuPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- RAM Usage -->
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <p class="text-sm font-medium text-gray-400">Memory</p>
            <span class="text-sm font-semibold text-gray-200">{{ ramText }}</span>
          </div>
          <div class="w-full bg-gray-700/50 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-500 ease-out"
              :class="getRamProgressColor(ramPercentage)"
              :style="{ width: `${ramPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Disk Usage -->
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <svg
              class="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <p class="text-sm font-medium text-gray-400">Storage</p>
            <span class="text-sm font-semibold text-gray-200">{{ diskText }}</span>
          </div>
          <div class="w-full bg-gray-700/50 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-500 ease-out"
              :class="getDiskProgressColor(diskPercentage)"
              :style="{ width: `${diskPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { SystemSchema } from '@/types/Sysinfo'
import { SystemServices } from '@/services/SystemServices'

const systemService = new SystemServices()
const systemData = ref<SystemSchema>()

// Computed values for display
const cpuPercentage = computed(() => {
  const usage = systemData.value?.cpu_usage || 0
  return Math.min(Math.max(usage, 0), 100).toFixed(1)
})

const ramPercentage = computed(() => {
  if (!systemData.value?.total_ram || !systemData.value?.ram_usage) return 0
  // RAM data is in bytes
  const percentage = (systemData.value.ram_usage / systemData.value.total_ram) * 100
  return Math.min(Math.max(percentage, 0), 100)
})

const ramText = computed(() => {
  if (!systemData.value?.total_ram || !systemData.value?.ram_usage) return '0 GB / 0 GB'

  // RAM data is in bytes, convert to GB
  const usedGB = (systemData.value.ram_usage / (1024 * 1024 * 1024)).toFixed(1)
  const totalGB = (systemData.value.total_ram / (1024 * 1024 * 1024)).toFixed(1)

  return `${usedGB} GB / ${totalGB} GB`
})

const diskPercentage = computed(() => {
  if (!systemData.value?.disks?.length) return 0

  // Deduplicate by filesystem to avoid counting the same disk multiple times
  const uniqueFilesystems = new Map()

  systemData.value.disks.forEach((disk) => {
    if (disk.filesystem && disk.total_space && disk.used_space) {
      // Use the first occurrence of each filesystem
      if (!uniqueFilesystems.has(disk.filesystem)) {
        uniqueFilesystems.set(disk.filesystem, disk)
      }
    }
  })

  let totalSpace = 0
  let usedSpace = 0

  uniqueFilesystems.forEach((disk) => {
    totalSpace += disk.total_space
    usedSpace += disk.used_space
  })

  if (totalSpace === 0) return 0
  const percentage = (usedSpace / totalSpace) * 100
  return Math.min(Math.max(percentage, 0), 100)
})

const diskText = computed(() => {
  if (!systemData.value?.disks?.length) return '0 GB / 0 GB'

  // Deduplicate by filesystem to avoid counting the same disk multiple times
  const uniqueFilesystems = new Map()

  systemData.value.disks.forEach((disk) => {
    if (disk.filesystem && disk.total_space && disk.used_space) {
      // Use the first occurrence of each filesystem
      if (!uniqueFilesystems.has(disk.filesystem)) {
        uniqueFilesystems.set(disk.filesystem, disk)
      }
    }
  })

  let totalSpace = 0
  let usedSpace = 0

  uniqueFilesystems.forEach((disk) => {
    totalSpace += disk.total_space
    usedSpace += disk.used_space
  })

  // Disk data is in MB, convert to GB
  const usedGB = (usedSpace / 1024).toFixed(1)
  const totalGB = (totalSpace / 1024).toFixed(1)

  return `${usedGB} GB / ${totalGB} GB`
})

// Progress bar color functions
const getCpuProgressColor = (usage: number): string => {
  if (usage >= 90) return 'bg-red-500'
  if (usage >= 70) return 'bg-orange-500'
  if (usage >= 50) return 'bg-yellow-500'
  return 'bg-purple-500'
}

const getRamProgressColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-orange-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-emerald-500'
}

const getDiskProgressColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-orange-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-blue-500'
}

// Start polling on mount
onMounted(() => {
  systemService.startPolling((data) => {
    systemData.value = data as SystemSchema
  })
})

// Stop polling on unmount
onUnmounted(() => {
  systemService.stopPolling()
})
</script>
