<template>
  <SidebarLayout>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
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
          <h1 class="text-3xl font-bold text-white">Container Details</h1>
          <p class="text-gray-400">{{ containerName }}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="toggleAllJsonViews"
          class="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors"
        >
          {{ showBasicInfoJson ? 'Show All Readable' : 'Show All JSON' }}
        </button>
        <div class="flex items-center gap-2">
          <div
            :class="['h-3 w-3 rounded-full', getStatusColor(container?.State?.Status || '')]"
          ></div>
          <div
            class="text-sm font-medium rounded-full px-3 py-1"
            :class="getStatusBadgeClass(container?.State?.Status || '')"
          >
            {{ container?.State?.Status }}
          </div>
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
    <div v-else-if="container" class="space-y-6">
      <!-- Basic Information Card -->
      <div class="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Basic Information</h2>
          <button
            @click="showBasicInfoJson = !showBasicInfoJson"
            class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
          >
            {{ showBasicInfoJson ? 'Show Readable' : 'Show JSON' }}
          </button>
        </div>

        <!-- Readable Basic Information View -->
        <div v-if="!showBasicInfoJson" class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <span class="text-gray-400">Platform:</span>
              <span class="text-gray-200">{{ container.Platform }}</span>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-400">Status:</span>
              <span class="text-gray-200">{{ container.State?.Status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Running:</span>
              <span class="text-gray-200">{{ container.State?.Running ? 'Yes' : 'No' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Created:</span>
              <span class="text-gray-200">{{ formatDate(container.Created) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Restart Count:</span>
              <span class="text-gray-200">{{ container.RestartCount }}</span>
            </div>
          </div>
        </div>

        <!-- JSON Basic Information View -->
        <div v-else class="bg-[#2a2a2a] rounded-lg p-3">
          <pre class="text-gray-200 text-sm">{{
            JSON.stringify(
              {
                Id: container.Id,
                Name: container.Name,
                Image: container.Image,
                Platform: container.Platform,
                State: container.State,
                Created: container.Created,
                RestartCount: container.RestartCount,
              },
              null,
              2,
            )
          }}</pre>
        </div>
      </div>

      <!-- Process Information -->
      <div class="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Process Information</h2>
          <button
            @click="showProcessInfoJson = !showProcessInfoJson"
            class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
          >
            {{ showProcessInfoJson ? 'Show Readable' : 'Show JSON' }}
          </button>
        </div>

        <!-- Readable Process Information View -->
        <div v-if="!showProcessInfoJson" class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-400">Path:</span>
            <span class="text-gray-200 font-mono text-sm">{{ container.Path }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Arguments:</span>
            <span class="text-gray-200 font-mono text-sm">{{ container.Args.join(' ') }}</span>
          </div>
          <div v-if="container.State?.Pid" class="flex justify-between">
            <span class="text-gray-400">Process ID:</span>
            <span class="text-gray-200">{{ container.State.Pid }}</span>
          </div>
          <div v-if="container.State?.StartedAt" class="flex justify-between">
            <span class="text-gray-400">Started At:</span>
            <span class="text-gray-200">{{ formatDate(container.State.StartedAt) }}</span>
          </div>
        </div>

        <!-- JSON Process Information View -->
        <div v-else class="bg-[#2a2a2a] rounded-lg p-3">
          <pre class="text-gray-200 text-sm">{{
            JSON.stringify(
              {
                Path: container.Path,
                Args: container.Args,
                State: {
                  Pid: container.State?.Pid,
                  StartedAt: container.State?.StartedAt,
                },
              },
              null,
              2,
            )
          }}</pre>
        </div>
      </div>

      <!-- Network Information -->
      <div class="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800">
        <h2 class="text-xl font-semibold text-white mb-4">Network Configuration</h2>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-400">Network Mode:</span>
            <span class="text-gray-200">{{ container.HostConfig.NetworkMode }}</span>
          </div>

          <!-- Port Bindings -->
          <div
            v-if="
              container.HostConfig.PortBindings &&
              Object.keys(container.HostConfig.PortBindings).length > 0
            "
          >
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-400">Port Bindings:</span>
              <button
                @click="showPortBindingsJson = !showPortBindingsJson"
                class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
              >
                {{ showPortBindingsJson ? 'Show Readable' : 'Show JSON' }}
              </button>
            </div>

            <!-- Readable Port Bindings View -->
            <div v-if="!showPortBindingsJson" class="bg-[#2a2a2a] rounded-lg p-3 space-y-2">
              <div
                v-for="(bindings, containerPort) in container.HostConfig.PortBindings"
                :key="containerPort"
                class="flex justify-between items-center p-2 bg-[#1e1e1e] rounded"
              >
                <div class="flex items-center gap-2">
                  <span class="text-blue-400 font-mono text-sm">{{ containerPort }}</span>
                  <span class="text-gray-500">→</span>
                  <div class="flex gap-1">
                    <span
                      v-for="binding in bindings"
                      :key="`${binding.HostIp}-${binding.HostPort}`"
                      class="text-green-400 font-mono text-sm bg-green-500/10 px-2 py-1 rounded"
                    >
                      {{ binding.HostIp || '*' }}:{{ binding.HostPort }}
                    </span>
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  {{ String(containerPort).split('/')[1]?.toUpperCase() || 'TCP' }}
                </div>
              </div>
            </div>

            <!-- JSON Port Bindings View -->
            <div v-else class="bg-[#2a2a2a] rounded-lg p-3">
              <pre class="text-gray-200 text-sm">{{
                JSON.stringify(container.HostConfig.PortBindings, null, 2)
              }}</pre>
            </div>
          </div>

          <!-- Network Details -->
          <div
            v-if="
              container.NetworkSettings?.Networks &&
              Object.keys(container.NetworkSettings.Networks).length > 0
            "
          >
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-400">Network Details:</span>
              <button
                @click="showNetworkDetailsJson = !showNetworkDetailsJson"
                class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
              >
                {{ showNetworkDetailsJson ? 'Show Readable' : 'Show JSON' }}
              </button>
            </div>

            <!-- Readable Network Details View -->
            <div v-if="!showNetworkDetailsJson" class="bg-[#2a2a2a] rounded-lg p-3 space-y-3">
              <div
                v-for="(network, networkName) in container.NetworkSettings.Networks"
                :key="networkName"
                class="p-3 bg-[#1e1e1e] rounded"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-gray-200 font-medium">{{ networkName }}</h3>
                  <span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {{ network.NetworkID?.substring(0, 12) || 'N/A' }}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div v-if="network.IPAddress" class="flex justify-between">
                    <span class="text-gray-400">IP Address:</span>
                    <span class="text-gray-200 font-mono">{{ network.IPAddress }}</span>
                  </div>
                  <div v-if="network.Gateway" class="flex justify-between">
                    <span class="text-gray-400">Gateway:</span>
                    <span class="text-gray-200 font-mono">{{ network.Gateway }}</span>
                  </div>
                  <div v-if="network.MacAddress" class="flex justify-between">
                    <span class="text-gray-400">MAC Address:</span>
                    <span class="text-gray-200 font-mono">{{ network.MacAddress }}</span>
                  </div>
                  <div v-if="network.IPPrefixLen" class="flex justify-between">
                    <span class="text-gray-400">Subnet:</span>
                    <span class="text-gray-200 font-mono"
                      >{{ network.IPAddress }}/{{ network.IPPrefixLen }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- JSON Network Details View -->
            <div v-else class="bg-[#2a2a2a] rounded-lg p-3">
              <pre class="text-gray-200 text-sm">{{
                JSON.stringify(container.NetworkSettings.Networks, null, 2)
              }}</pre>
            </div>
          </div>

          <!-- Legacy IP Address Information (fallback) -->
          <div
            v-if="container.NetworkSettings?.IPAddress && !container.NetworkSettings?.Networks"
            class="flex justify-between"
          >
            <span class="text-gray-400">IP Address:</span>
            <span class="text-gray-200 font-mono">{{ container.NetworkSettings.IPAddress }}</span>
          </div>
          <div
            v-if="container.NetworkSettings?.Gateway && !container.NetworkSettings?.Networks"
            class="flex justify-between"
          >
            <span class="text-gray-400">Gateway:</span>
            <span class="text-gray-200 font-mono">{{ container.NetworkSettings.Gateway }}</span>
          </div>
          <div
            v-if="container.NetworkSettings?.MacAddress && !container.NetworkSettings?.Networks"
            class="flex justify-between"
          >
            <span class="text-gray-400">MAC Address:</span>
            <span class="text-gray-200 font-mono">{{ container.NetworkSettings.MacAddress }}</span>
          </div>
        </div>
      </div>

      <!-- Volume Mounts -->
      <div
        v-if="container.Mounts && container.Mounts.length"
        class="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Volume Mounts</h2>
          <button
            @click="showVolumeMountsJson = !showVolumeMountsJson"
            class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
          >
            {{ showVolumeMountsJson ? 'Show Readable' : 'Show JSON' }}
          </button>
        </div>

        <!-- Readable Volume Mounts View -->
        <div v-if="!showVolumeMountsJson" class="space-y-3">
          <div
            v-for="mount in container.Mounts"
            :key="mount.Destination"
            class="bg-[#2a2a2a] rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-gray-200 font-medium">{{ mount.Type || 'bind' }}</span>
              <span
                class="text-xs px-2 py-1 rounded"
                :class="mount.RW ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
              >
                {{ mount.RW ? 'Read/Write' : 'Read Only' }}
              </span>
            </div>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Source:</span>
                <span class="text-gray-200 font-mono">{{ mount.Source || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Destination:</span>
                <span class="text-gray-200 font-mono">{{ mount.Destination }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- JSON Volume Mounts View -->
        <div v-else class="bg-[#2a2a2a] rounded-lg p-3">
          <pre class="text-gray-200 text-sm">{{ JSON.stringify(container.Mounts, null, 2) }}</pre>
        </div>
      </div>

      <!-- Resource Information -->
      <div class="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Resource Information</h2>
          <button
            @click="showResourceInfoJson = !showResourceInfoJson"
            class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
          >
            {{ showResourceInfoJson ? 'Show Readable' : 'Show JSON' }}
          </button>
        </div>

        <!-- Readable Resource Information View -->
        <div v-if="!showResourceInfoJson" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div v-if="container.HostConfig.Memory" class="flex justify-between">
              <span class="text-gray-400">Memory Limit:</span>
              <span class="text-gray-200"
                >{{ Math.round(container.HostConfig.Memory / 1024 / 1024) }} MB</span
              >
            </div>
            <div v-if="container.HostConfig.CpuShares" class="flex justify-between">
              <span class="text-gray-400">CPU Shares:</span>
              <span class="text-gray-200">{{ container.HostConfig.CpuShares }}</span>
            </div>
            <div v-if="container.SizeRw" class="flex justify-between">
              <span class="text-gray-400">Writable Size:</span>
              <span class="text-gray-200">{{ Math.round(container.SizeRw / 1024 / 1024) }} MB</span>
            </div>
          </div>
          <div class="space-y-3">
            <div v-if="container.SizeRootFs" class="flex justify-between">
              <span class="text-gray-400">Root FS Size:</span>
              <span class="text-gray-200"
                >{{ Math.round(container.SizeRootFs / 1024 / 1024) }} MB</span
              >
            </div>
            <div v-if="container.HostConfig.CpusetCpus" class="flex justify-between">
              <span class="text-gray-400">CPU Set:</span>
              <span class="text-gray-200">{{ container.HostConfig.CpusetCpus }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Driver:</span>
              <span class="text-gray-200">{{ container.Driver }}</span>
            </div>
          </div>
        </div>

        <!-- JSON Resource Information View -->
        <div v-else class="bg-[#2a2a2a] rounded-lg p-3">
          <pre class="text-gray-200 text-sm">{{
            JSON.stringify(
              {
                HostConfig: {
                  Memory: container.HostConfig.Memory,
                  CpuShares: container.HostConfig.CpuShares,
                  CpusetCpus: container.HostConfig.CpusetCpus,
                },
                SizeRw: container.SizeRw,
                SizeRootFs: container.SizeRootFs,
                Driver: container.Driver,
              },
              null,
              2,
            )
          }}</pre>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800">
        <h2 class="text-xl font-semibold text-white mb-4">Actions</h2>
        <div class="flex flex-wrap gap-3">
          <button
            v-if="container.State?.Running"
            @click="handleAction(DockerAction.stop)"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6 6h12v12H6z" />
            </svg>
            Stop Container
          </button>
          <button
            v-else-if="!container.State?.Running && container.State?.Status === 'exited'"
            @click="handleAction(DockerAction.start)"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="m7 4 10 8L7 20V4z" />
            </svg>
            Start Container
          </button>
          <button
            @click="handleAction(DockerAction.restart)"
            class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
            @click="handleAction(DockerAction.delete)"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
  </SidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import { dockerServices } from '@/services/DockerServices'
import { type ContainerInspectResponse, DockerAction } from '@/types/Docker'
import { parseAction } from '@/utils/Docker'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const container = ref<ContainerInspectResponse | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Add state for toggling JSON views
const showPortBindingsJson = ref(false)
const showNetworkDetailsJson = ref(false)
const showBasicInfoJson = ref(false)
const showProcessInfoJson = ref(false)
const showVolumeMountsJson = ref(false)
const showResourceInfoJson = ref(false)

// Global JSON toggle function
const toggleAllJsonViews = () => {
  const newState = !showBasicInfoJson.value
  showBasicInfoJson.value = newState
  showProcessInfoJson.value = newState
  showVolumeMountsJson.value = newState
  showResourceInfoJson.value = newState
  showPortBindingsJson.value = newState
  showNetworkDetailsJson.value = newState
}

const containerId = computed(() => route.params.id as string)
const containerName = computed(() => {
  if (!container.value) return 'Unknown'
  return container.value.Name?.replace(/^\//, '') || 'Unknown'
})

// Fetch container detail using the new API
const fetchContainerDetails = async () => {
  if (!containerId.value) return

  isLoading.value = true
  error.value = null

  try {
    const containerDetails = await dockerServices.getContainerDetails(containerId.value)
    container.value = containerDetails
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

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleString()
}

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}

const goBack = () => {
  router.push('/services')
}

const handleAction = (action: DockerAction) => {
  // TODO: Implement container actions
  const fakeDockerLoading = () => new Promise((resolve) => setTimeout(resolve, 2000))
  const actionMessage = parseAction(action)
  toast.promise(fakeDockerLoading, {
    loading: `${actionMessage}...`,
    success: () => `${actionMessage} completed`,
    error: () => `${actionMessage} failed`,
  })
  console.log(`${action} container:`, container.value?.Id)
}

// Load container details on mount
onMounted(() => {
  fetchContainerDetails()
})
</script>
