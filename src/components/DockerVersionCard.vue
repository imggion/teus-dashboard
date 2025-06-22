<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { dockerServices } from '@/services/DockerServices'
import type { DockerVersion } from '@/types/Docker'
import GenericSysInfoCard from './generics/GenericSysInfoCard.vue'

const {
  data: dockerVersionData,
  refetch,
  isLoading,
  error,
} = useQuery({
  queryKey: ['dockerVersion'],
  queryFn: () => dockerServices.getDockerVersion(),
  retry: 2,
  refetchOnWindowFocus: false,
})

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

const formatGitCommit = (commit: string) => {
  return commit ? commit.substring(0, 8) : 'Unknown'
}

const getMainComponent = computed(() => {
  if (!dockerVersionData.value?.Components) return null
  return (
    dockerVersionData.value.Components.find(
      (comp) =>
        comp.Name.toLowerCase().includes('engine') || comp.Name.toLowerCase().includes('docker'),
    ) || dockerVersionData.value.Components[0]
  )
})

const handleRefresh = async () => {
  try {
    await refetch()
    toast.success('Docker version updated')
  } catch (error) {
    console.error('Failed to refresh Docker version:', error)
    toast.error('Failed to refresh Docker version')
  }
}
</script>

<template>
  <div
    class="bg-[#1e1e1e] rounded-3xl border border-gray-700/30 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/20"
  >
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <span>Docker Information</span>
          <div
            v-if="isLoading"
            class="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"
          ></div>
        </h2>
        <div class="flex gap-2">
          <button
            @click.prevent="handleRefresh"
            :disabled="isLoading"
            class="bg-[#2a2a2a] cursor-pointer hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-all duration-200 group"
          >
            <span>Refresh</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              :class="[
                'transition-transform duration-200',
                isLoading ? 'animate-spin' : 'group-hover:rotate-90',
              ]"
            >
              <path
                fill="currentColor"
                d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error && !isLoading" class="text-center py-8">
        <p class="text-gray-400 text-sm">
          {{ error?.message || 'Failed to load Docker information' }}
        </p>
        <p class="text-gray-500 text-xs mt-1">Docker might not be running or accessible</p>
      </div>

      <!-- Loading Skeleton -->
      <div
        v-else-if="isLoading && !dockerVersionData"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
      >
        <div v-for="i in 8" :key="i" class="animate-pulse bg-[#2a2a2a] rounded-2xl p-3 h-20">
          <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-6 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Docker Version Grid -->
      <div
        v-else-if="dockerVersionData"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
      >
        <!-- Docker Version -->
        <div class="flex">
          <GenericSysInfoCard
            icon="docker"
            title="Docker Version"
            class="flex-1 flex flex-col min-h-[120px]"
          >
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg transition-colors duration-200 hover:text-blue-300"
              >
                {{ dockerVersionData.Version || 'Unknown' }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>

        <!-- API Version -->
        <div class="flex">
          <GenericSysInfoCard
            icon="globe"
            title="API Version"
            class="flex-1 flex flex-col min-h-[120px]"
          >
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg transition-colors duration-200 hover:text-blue-300"
              >
                {{ dockerVersionData.ApiVersion || 'Unknown' }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>

        <!-- Platform -->
        <div class="flex">
          <GenericSysInfoCard
            icon="serverStack"
            title="Platform"
            class="flex-1 flex flex-col min-h-[120px]"
          >
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg transition-colors duration-200 hover:text-blue-300"
              >
                {{ dockerVersionData.Platform?.Name || 'Unknown' }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>

        <!-- Architecture -->
        <div class="flex">
          <GenericSysInfoCard
            icon="system"
            title="Architecture"
            class="flex-1 flex flex-col min-h-[120px]"
          >
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg transition-colors duration-200 hover:text-blue-300"
              >
                {{ dockerVersionData.Arch || 'Unknown' }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>

        <!-- Operating System -->
        <div class="flex">
          <GenericSysInfoCard icon="home" title="OS" class="flex-1 flex flex-col min-h-[120px]">
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg transition-colors duration-200 hover:text-blue-300"
              >
                {{ dockerVersionData.Os || 'Unknown' }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>

        <!-- Go Version -->
        <div class="flex">
          <GenericSysInfoCard
            icon="vscode"
            title="Go Version"
            class="flex-1 flex flex-col min-h-[120px]"
          >
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg transition-colors duration-200 hover:text-blue-300"
              >
                {{ dockerVersionData.GoVersion || 'Unknown' }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>

        <!-- Git Commit -->
        <div class="flex">
          <GenericSysInfoCard
            icon="gitlab"
            title="Git Commit"
            class="flex-1 flex flex-col min-h-[120px]"
          >
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg font-mono transition-colors duration-200 hover:text-blue-300"
              >
                {{ formatGitCommit(dockerVersionData.GitCommit) }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>

        <!-- Build Time -->
        <div class="flex">
          <GenericSysInfoCard
            icon="clock"
            title="Build Time"
            class="flex-1 flex flex-col min-h-[120px]"
          >
            <div class="flex-1 flex items-center">
              <p
                class="text-gray-200 font-medium text-lg transition-colors duration-200 hover:text-blue-300"
              >
                {{ formatDate(dockerVersionData.BuildTime) }}
              </p>
            </div>
          </GenericSysInfoCard>
        </div>
      </div>

      <!-- Components Section -->
      <div
        v-if="dockerVersionData?.Components?.length"
        class="mt-6 pt-6 border-t border-gray-700/30"
      >
        <h3 class="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            class="text-blue-400"
          >
            <path
              fill="currentColor"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          Components
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="component in dockerVersionData.Components"
            :key="component.Name"
            class="bg-[#2a2a2a] rounded-xl p-4 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-200"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-200">{{ component.Name }}</h4>
              <span class="text-blue-400 text-sm font-mono">{{ component.Version }}</span>
            </div>
            <div v-if="component.Details" class="space-y-1 text-sm">
              <div v-if="component.Details.ApiVersion" class="flex justify-between">
                <span class="text-gray-400">API:</span>
                <span class="text-gray-300 font-mono">{{ component.Details.ApiVersion }}</span>
              </div>
              <div v-if="component.Details.GitCommit" class="flex justify-between">
                <span class="text-gray-400">Commit:</span>
                <span class="text-gray-300 font-mono">{{
                  formatGitCommit(component.Details.GitCommit)
                }}</span>
              </div>
              <div v-if="component.Details.BuildTime" class="flex justify-between">
                <span class="text-gray-400">Built:</span>
                <span class="text-gray-300">{{ formatDate(component.Details.BuildTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component uses design system classes for consistency */
</style>
