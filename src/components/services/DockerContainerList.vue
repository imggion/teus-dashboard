<template>
  <div class="docker-containers">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-200">Docker Containers</h2>
      <div class="flex gap-2">
        <button
          @click="fetchContainers"
          :disabled="isLoading"
          class="bg-[#2a2a2a] hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-all"
        >
          <span>Refresh</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            :class="{ 'animate-spin': isLoading }"
          >
            <path
              fill="currentColor"
              d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
            />
          </svg>
        </button>
        <button
          disabled
          class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
        >
          <span>New container</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search containers..."
        class="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <span class="ml-3 text-gray-400">Loading containers...</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center"
    >
      <div class="text-red-400 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="mx-auto mb-2"
        >
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>
      </div>
      <p class="text-red-400 font-medium">Failed to load containers</p>
      <p class="text-gray-400 text-sm mt-1">{{ error }}</p>
      <button
        @click="fetchContainers"
        class="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredContainers.length" class="text-center py-12">
      <div class="text-gray-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          class="mx-auto mb-4"
        >
          <path
            fill="currentColor"
            d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
          />
        </svg>
      </div>
      <p class="text-gray-400 text-lg font-medium">No containers found</p>
      <p class="text-gray-500 text-sm mt-1">
        {{
          searchQuery
            ? 'Try adjusting your search criteria'
            : 'No Docker containers are currently running'
        }}
      </p>
    </div>

    <!-- Container Grid -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="container in filteredContainers"
        :key="container.Id"
        class="bg-[#1a1a1a] rounded-xl border border-gray-700/30 overflow-hidden shadow-lg hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
        @click="toggleExpanded(container.Id)"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div :class="['h-3 w-3 rounded-full', getStatusColor(container.State)]"></div>
              <h3 class="font-semibold text-gray-200 truncate">
                {{ getContainerName(container) }}
              </h3>
            </div>
            <div
              class="text-xs font-medium rounded-full px-2 py-0.5"
              :class="getStatusBadgeClass(container.State)"
            >
              {{ container.State }}
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm">
              <span class="text-gray-400 w-20">Image:</span>
              <span class="text-gray-200 truncate">{{ container.Image }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-gray-400 w-20">ID:</span>
              <span class="text-gray-200 font-mono text-xs truncate">{{
                container.Id.substring(0, 12)
              }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-gray-400 w-20">Ports:</span>
              <span class="text-gray-200">{{ formatPorts(container.Ports) }}</span>
            </div>
          </div>

          <!-- Expanded Details -->
          <div
            v-if="expandedContainers.has(container.Id)"
            class="border-t border-gray-700/30 pt-3 mb-4"
          >
            <div class="space-y-2 text-sm">
              <div class="flex items-center">
                <span class="text-gray-400 w-20">Status:</span>
                <span class="text-gray-200">{{ container.Status }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-400 w-20">Created:</span>
                <span class="text-gray-200">{{ formatDate(container.Created) }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-400 w-20">Command:</span>
                <span class="text-gray-200 font-mono text-xs truncate">{{
                  container.Command
                }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-400 w-20">Network:</span>
                <span class="text-gray-200">{{ container.HostConfig.NetworkMode }}</span>
              </div>
              <div v-if="container.Mounts.length" class="flex items-start">
                <span class="text-gray-400 w-20">Mounts:</span>
                <div class="text-gray-200 space-y-1 flex-1">
                  <div
                    v-for="mount in container.Mounts.slice(0, 2)"
                    :key="mount.Source"
                    class="text-xs font-mono"
                  >
                    {{ mount.Source }} → {{ mount.Destination }}
                  </div>
                  <div v-if="container.Mounts.length > 2" class="text-xs text-gray-500">
                    +{{ container.Mounts.length - 2 }} more...
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between border-t border-gray-700/30 pt-3">
            <div>
              <button
                v-if="container.State === 'running'"
                class="text-xs bg-red-400/10 hover:bg-red-400/20 text-red-400 py-1 px-2 rounded transition-colors"
                @click.stop="handleContainerAction(DockerAction.stop, container)"
              >
                Stop
              </button>
              <button
                v-else-if="container.State === 'exited'"
                class="text-xs bg-green-400/10 hover:bg-green-400/20 text-green-400 py-1 px-2 rounded transition-colors"
                @click.stop="handleContainerAction(DockerAction.start, container)"
              >
                Start
              </button>
              <button
                v-else
                class="text-xs bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 py-1 px-2 rounded transition-colors"
                @click.stop="handleContainerAction(DockerAction.restart, container)"
              >
                Restart
              </button>
            </div>
            <div class="flex gap-2">
              <button
                class="text-gray-400 hover:text-red-400 transition-colors"
                @click.stop="handleContainerAction(DockerAction.delete, container)"
                title="Delete container"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M7 22q-.825 0-1.413-.588T5 20V6H4V4h5V3h6v1h5v2h-1v14q0 .825-.588 1.413T17 22H7Zm2-4h2V8H9v10Zm4 0h2V8h-2v10Z"
                  />
                </svg>
              </button>
              <button
                class="text-gray-400 hover:text-purple-400 transition-colors"
                @click.stop="viewContainerDetails(container)"
                title="View details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
                  <path
                    fill="currentColor"
                    d="M16 28A12 12 0 1 0 4 16a12 12 0 0 0 12 12zm0-22a10 10 0 1 1-10 10a10 10 0 0 1 10-10z"
                  />
                  <path fill="currentColor" d="M16 22a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 22z" />
                  <path
                    fill="currentColor"
                    d="M16 18a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dockerServices } from '@/services/DockerServices'
import { type Container, DockerAction } from '@/types/Docker'
import { toast } from 'vue-sonner'
import { parseAction } from '@/utils/Docker'

const router = useRouter()
const containers = ref<Container[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const expandedContainers = ref(new Set<string>())

// Computed property for filtered containers
const filteredContainers = computed(() => {
  if (!searchQuery.value) return containers.value

  const query = searchQuery.value.toLowerCase()
  return containers.value.filter(
    (container) =>
      getContainerName(container).toLowerCase().includes(query) ||
      container.Image.toLowerCase().includes(query) ||
      container.Id.toLowerCase().includes(query) ||
      container.State.toLowerCase().includes(query),
  )
})

// Fetch containers from API
const fetchContainers = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await dockerServices.getContainers()
    containers.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch containers'
    toast.error('Failed to fetch containers')
    console.error('Error fetching containers:', err)
  } finally {
    isLoading.value = false
  }
}

// Helper functions
const getContainerName = (container: Container): string => {
  return container.Names[0]?.replace(/^\//, '') || 'Unknown'
}

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

const formatPorts = (ports: Container['Ports']): string => {
  if (!ports || ports.length === 0) return 'None'

  return (
    ports
      .filter((port) => port.PublicPort)
      .map((port) => `${port.PublicPort}:${port.PrivatePort}`)
      .join(', ') || 'Internal only'
  )
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}

const toggleExpanded = (containerId: string) => {
  if (expandedContainers.value.has(containerId)) {
    expandedContainers.value.delete(containerId)
  } else {
    expandedContainers.value.add(containerId)
  }
}

const handleContainerAction = (action: DockerAction, container: Container) => {
  // TODO: Implement container actions (start, stop, restart, delete)
  const fakeDockerLoading = () => new Promise((resolve) => setTimeout(resolve, 2000))
  const actionMessage = parseAction(action)
  toast.promise(fakeDockerLoading, {
    loading: `${actionMessage}...`,
    success: () => `${actionMessage} completed`,
    error: () => `${actionMessage} failed`,
  })
  console.log(`${action} container:`, container.Id)
}

const viewContainerDetails = (container: Container) => {
  router.push(`/containers/${container.Id}`)
}

// Load containers on mount
onMounted(() => {
  fetchContainers()
})
</script>
