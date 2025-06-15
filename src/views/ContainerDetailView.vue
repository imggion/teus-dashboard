<template>
  <main>
    <HomeLayout>
      <Navbar />
      <div class="bg-[#121212] text-white flex flex-col p-5">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <button
              @click="goBack"
              class="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200 p-2 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"
                />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-200">Container Details</h1>
              <p class="text-gray-400">{{ containerName }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div :class="['h-3 w-3 rounded-full', getStatusColor(container?.State || '')]"></div>
            <div
              class="text-sm font-medium rounded-full px-3 py-1"
              :class="getStatusBadgeClass(container?.State || '')"
            >
              {{ container?.State }}
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span class="ml-3 text-gray-400">Loading container details...</span>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center max-w-2xl mx-auto"
        >
          <div class="text-red-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              class="mx-auto"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </div>
          <p class="text-red-400 font-medium text-lg">Failed to load container details</p>
          <p class="text-gray-400 text-sm mt-2">{{ error }}</p>
          <button
            @click="fetchContainerDetails"
            class="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>

        <!-- Container Details -->
        <div v-else-if="container" class="max-w-6xl mx-auto w-full space-y-6">
          <!-- Basic Information Card -->
          <div
            class="bg-[#1e1e1e] bg-opacity-50 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/5"
          >
            <h2 class="text-xl font-semibold text-gray-200 mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-400">Container ID:</span>
                  <span class="text-gray-200 font-mono text-sm">{{ container.Id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Name:</span>
                  <span class="text-gray-200">{{ containerName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Image:</span>
                  <span class="text-gray-200">{{ container.Image }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Image ID:</span>
                  <span class="text-gray-200 font-mono text-sm"
                    >{{ container.ImageID.substring(0, 19) }}...</span
                  >
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-400">Status:</span>
                  <span class="text-gray-200">{{ container.Status }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">State:</span>
                  <span class="text-gray-200">{{ container.State }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Created:</span>
                  <span class="text-gray-200">{{ formatDate(container.Created) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Command:</span>
                  <span class="text-gray-200 font-mono text-sm truncate">{{
                    container.Command
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Network Information -->
          <div
            class="bg-[#1e1e1e] bg-opacity-50 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/5"
          >
            <h2 class="text-xl font-semibold text-gray-200 mb-4">Network Configuration</h2>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-400">Network Mode:</span>
                <span class="text-gray-200">{{ container.HostConfig.NetworkMode }}</span>
              </div>

              <!-- Port Mappings -->
              <div v-if="container.Ports && container.Ports.length">
                <span class="text-gray-400 block mb-2">Port Mappings:</span>
                <div class="space-y-2">
                  <div
                    v-for="port in container.Ports"
                    :key="`${port.PrivatePort}-${port.Type}`"
                    class="bg-[#2a2a2a] rounded-lg p-3 flex justify-between items-center"
                  >
                    <span class="text-gray-200 font-mono text-sm">
                      {{
                        port.PublicPort
                          ? `${port.PublicPort}:${port.PrivatePort}`
                          : port.PrivatePort
                      }}
                    </span>
                    <span class="text-gray-400 text-sm">{{ port.Type.toUpperCase() }}</span>
                  </div>
                </div>
              </div>

              <!-- Network Details -->
              <div v-if="container.NetworkSettings?.Networks">
                <span class="text-gray-400 block mb-2">Network Details:</span>
                <div
                  v-for="(network, name) in container.NetworkSettings.Networks"
                  :key="name"
                  class="bg-[#2a2a2a] rounded-lg p-3"
                >
                  <div class="font-medium text-gray-200 mb-2">{{ name }}</div>
                  <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-400">IP Address:</span>
                      <span class="text-gray-200 font-mono">{{ network.IPAddress || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">Gateway:</span>
                      <span class="text-gray-200 font-mono">{{ network.Gateway || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">MAC Address:</span>
                      <span class="text-gray-200 font-mono">{{ network.MacAddress || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Volume Mounts -->
          <div
            v-if="container.Mounts && container.Mounts.length"
            class="bg-[#1e1e1e] bg-opacity-50 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/5"
          >
            <h2 class="text-xl font-semibold text-gray-200 mb-4">Volume Mounts</h2>
            <div class="space-y-3">
              <div
                v-for="mount in container.Mounts"
                :key="mount.Source"
                class="bg-[#2a2a2a] rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="text-gray-200 font-medium">{{ mount.Type }}</span>
                  <span
                    class="text-xs px-2 py-1 rounded"
                    :class="
                      mount.RW
                        ? 'bg-green-100/10 text-green-400'
                        : 'bg-orange-100/10 text-orange-400'
                    "
                  >
                    {{ mount.RW ? 'Read/Write' : 'Read Only' }}
                  </span>
                </div>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Source:</span>
                    <span class="text-gray-200 font-mono break-all">{{ mount.Source }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Destination:</span>
                    <span class="text-gray-200 font-mono break-all">{{ mount.Destination }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Mode:</span>
                    <span class="text-gray-200 font-mono">{{ mount.Mode }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Labels -->
          <div
            v-if="container.Labels && Object.keys(container.Labels).length"
            class="bg-[#1e1e1e] bg-opacity-50 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/5"
          >
            <h2 class="text-xl font-semibold text-gray-200 mb-4">Labels</h2>
            <div class="space-y-2">
              <div
                v-for="(value, key) in container.Labels"
                :key="key"
                class="bg-[#2a2a2a] rounded-lg p-3"
              >
                <div class="flex justify-between items-start">
                  <span class="text-gray-400 text-sm font-mono break-all">{{ key }}</span>
                  <span class="text-gray-200 text-sm break-all ml-4">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="bg-[#1e1e1e] bg-opacity-50 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/5"
          >
            <h2 class="text-xl font-semibold text-gray-200 mb-4">Actions</h2>
            <div class="flex gap-3">
              <button
                v-if="container.State === 'running'"
                @click="handleAction('stop')"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 6h12v12H6z" />
                </svg>
                Stop Container
              </button>
              <button
                v-else-if="container.State === 'exited'"
                @click="handleAction('start')"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
                Start Container
              </button>
              <button
                @click="handleAction('restart')"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
                  />
                </svg>
                Restart Container
              </button>
              <button
                @click="handleAction('delete')"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M7 22q-.825 0-1.413-.588T5 20V6H4V4h5V3h6v1h5v2h-1v14q0 .825-.588 1.413T17 22H7Zm2-4h2V8H9v10Zm4 0h2V8h-2v10Z"
                  />
                </svg>
                Delete Container
              </button>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout.vue'
import Navbar from '@/components/navbar/Navbar.vue'
import { dockerServices } from '@/services/DockerServices'
import type { Container } from '@/types/Docker'

const route = useRoute()
const router = useRouter()

const container = ref<Container | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const containerId = computed(() => route.params.id as string)
const containerName = computed(() => {
  if (!container.value) return 'Unknown'
  return container.value.Names[0]?.replace(/^\//, '') || 'Unknown'
})

// Fetch container details
const fetchContainerDetails = async () => {
  if (!containerId.value) return

  isLoading.value = true
  error.value = null

  try {
    const containers = await dockerServices.getContainers()
    const foundContainer = containers.find(
      (c) => c.Id === containerId.value || c.Id.startsWith(containerId.value),
    )

    if (foundContainer) {
      container.value = foundContainer
    } else {
      error.value = 'Container not found'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch container details'
    console.error('Error fetching container details:', err)
  } finally {
    isLoading.value = false
  }
}

// Helper functions
const getStatusColor = (state: string): string => {
  switch (state.toLowerCase()) {
    case 'running':
      return 'bg-green-400'
    case 'exited':
      return 'bg-red-400'
    case 'paused':
      return 'bg-yellow-400'
    default:
      return 'bg-gray-400'
  }
}

const getStatusBadgeClass = (state: string): string => {
  switch (state.toLowerCase()) {
    case 'running':
      return 'bg-green-100/10 text-green-400'
    case 'exited':
      return 'bg-red-100/10 text-red-400'
    case 'paused':
      return 'bg-yellow-100/10 text-yellow-400'
    default:
      return 'bg-gray-100/10 text-gray-400'
  }
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}

const goBack = () => {
  router.push('/services')
}

const handleAction = (action: string) => {
  // TODO: Implement container actions
  console.log(`${action} container:`, container.value?.Id)
}

// Load container details on mount
onMounted(() => {
  fetchContainerDetails()
})
</script>
