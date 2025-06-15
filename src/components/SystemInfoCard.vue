<template>
  <div
    class="bg-[#1e1e1e] rounded-3xl border border-gray-700/30 overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-500/20"
  >
    <div class="p-4">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <span class="opacity-0 animate-fade-in-left" style="animation-delay: 0.1s"
            >System Information</span
          >
          <div
            v-if="isLoading"
            class="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin opacity-0 animate-fade-in"
            style="animation-delay: 0.2s"
          ></div>
        </h2>
        <div class="flex gap-2 opacity-0 animate-fade-in-right" style="animation-delay: 0.3s">
          <button
            @click.prevent="handleRefetchSysInfo"
            :disabled="isLoading"
            class="bg-[#2a2a2a] cursor-pointer hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <span class="transition-transform duration-200 group-hover:translate-x-[-2px]"
              >Refresh</span
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              :class="[
                'transition-transform duration-300 group-hover:translate-x-1',
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

      <!-- Loading Skeleton -->
      <div
        v-if="isLoading && !systemInfoServices.hostname"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="animate-pulse bg-[#2a2a2a] rounded-2xl p-4 h-24"
          :style="`animation-delay: ${i * 0.1}s`"
        >
          <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-6 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>

      <!-- System Info Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <!-- Hostname -->
        <div class="opacity-0 animate-slide-in-card" style="animation-delay: 0.1s">
          <GenericSysInfoCard icon="home" title="Hostname">
            <p
              class="text-gray-200 font-medium text-lg transition-all duration-300 hover:text-purple-300"
            >
              {{ systemInfoServices.hostname || 'Loading...' }}
            </p>
          </GenericSysInfoCard>
        </div>

        <!-- Operating System -->
        <div class="opacity-0 animate-slide-in-card" style="animation-delay: 0.2s">
          <GenericSysInfoCard icon="serverStack" title="Operating System">
            <p
              class="text-gray-200 font-medium text-lg transition-all duration-300 hover:text-purple-300"
            >
              {{ systemInfoServices.os || 'Loading...' }}
            </p>
          </GenericSysInfoCard>
        </div>

        <!-- Kernel Version -->
        <div class="opacity-0 animate-slide-in-card" style="animation-delay: 0.3s">
          <GenericSysInfoCard icon="horizontalKeyframe" title="Kernel Version">
            <p
              class="text-gray-200 font-medium text-lg transition-all duration-300 hover:text-purple-300"
            >
              {{ systemInfoServices.kernel_version || 'Loading...' }}
            </p>
          </GenericSysInfoCard>
        </div>

        <!-- Uptime -->
        <div class="opacity-0 animate-slide-in-card" style="animation-delay: 0.4s">
          <GenericSysInfoCard icon="clock" title="Uptime">
            <p
              class="text-gray-200 font-medium text-lg transition-all duration-300 hover:text-purple-300"
            >
              {{ systemInfoServices.uptime || 'Loading...' }}
            </p>
          </GenericSysInfoCard>
        </div>

        <!-- IP Address -->
        <div class="opacity-0 animate-slide-in-card" style="animation-delay: 0.5s">
          <GenericSysInfoCard icon="globe" title="IP Address">
            <p
              class="text-gray-200 font-medium text-lg transition-all duration-300 hover:text-purple-300"
            >
              {{ getPrimaryIPv4 }}
            </p>
          </GenericSysInfoCard>
        </div>

        <!-- Network Interfaces -->
        <div class="opacity-0 animate-slide-in-card" style="animation-delay: 0.6s">
          <GenericSysInfoCard icon="globe" title="Networks">
            <template #end-element>
              <select
                v-if="sortedNetworks.length > 0"
                v-model="selectedNetworkInterface"
                class="px-2 py-1 bg-[#2a2a2a] rounded-lg text-gray-200 text-sm border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-[#3a3a3a]"
              >
                <option
                  v-for="network in sortedNetworks"
                  :key="`${network.interface}-${network.addr}`"
                  :value="`${network.interface}-${network.addr}`"
                >
                  {{ network.interface }} - {{ isIPv4(network.addr) ? 'IPv4' : 'IPv6' }}
                </option>
              </select>
            </template>
            <p
              v-if="selectedNetworkInterface"
              class="text-gray-200 font-medium text-lg mt-2 transition-all duration-300 hover:text-purple-300"
            >
              {{ getSelectedNetwork?.addr }}
            </p>
            <p v-else class="text-gray-400 text-sm mt-2">No networks available</p>
          </GenericSysInfoCard>
        </div>

        <!-- MAC Addresses -->
        <div class="opacity-0 animate-slide-in-card" style="animation-delay: 0.7s">
          <GenericSysInfoCard icon="globe" title="MAC Addresses">
            <template #end-element>
              <select
                v-if="sortedMacAddresses.length > 0"
                v-model="selectedMacInterface"
                class="px-2 py-1 bg-[#2a2a2a] rounded-lg text-gray-200 text-sm border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-[#3a3a3a]"
              >
                <option
                  v-for="macAddress in sortedMacAddresses"
                  :key="macAddress.interface"
                  :value="macAddress.interface"
                >
                  {{ macAddress.interface }}
                </option>
              </select>
            </template>
            <p
              v-if="selectedMacInterface"
              class="text-gray-200 font-medium text-lg mt-2 transition-all duration-300 hover:text-purple-300"
            >
              {{ getSelectedMacAddress?.mac }}
            </p>
            <p v-else class="text-gray-400 text-sm mt-2">No MAC addresses available</p>
          </GenericSysInfoCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import genericSystemServices from '@/services/GenericSysServices'
import type { GenericSysinfoSchema } from '@/types/Sysinfo'
import { ref, onMounted, computed, watch } from 'vue'
import GenericSysInfoCard from './generics/GenericSysInfoCard.vue'
import { useQuery } from '@tanstack/vue-query'

const systemInfoServices = ref<GenericSysinfoSchema>({})
const selectedNetworkInterface = ref<string>('')
const selectedMacInterface = ref<string>('')

const {
  data: systemInfoData,
  refetch,
  isLoading,
} = useQuery({
  queryKey: ['systemInfo'],
  queryFn: () => genericSystemServices.getSystemInfo(),
})

// Helper function to check if an IP address is IPv4
const isIPv4 = (ip: string): boolean => {
  return /^\d+\.\d+\.\d+\.\d+$/.test(ip)
}

// Helper function to check if an interface is an Ethernet interface
const isEthernetInterface = (interfaceName: string): boolean => {
  return /^en\d+/.test(interfaceName)
}

// Sort networks to prioritize Ethernet and IPv4
const sortedNetworks = computed(() => {
  if (!systemInfoServices.value.networks) return []

  return [...systemInfoServices.value.networks].sort((a, b) => {
    // First prioritize Ethernet interfaces
    const aIsEthernet = isEthernetInterface(a.interface)
    const bIsEthernet = isEthernetInterface(b.interface)

    if (aIsEthernet && !bIsEthernet) return -1
    if (!aIsEthernet && bIsEthernet) return 1

    // Then prioritize IPv4 over IPv6
    const aIsIPv4 = isIPv4(a.addr)
    const bIsIPv4 = isIPv4(b.addr)

    if (aIsIPv4 && !bIsIPv4) return -1
    if (!aIsIPv4 && bIsIPv4) return 1

    // If both are the same type, sort by interface name
    return a.interface.localeCompare(b.interface)
  })
})

// Sort MAC addresses to prioritize Ethernet interfaces
const sortedMacAddresses = computed(() => {
  if (!systemInfoServices.value.mac_addresses) return []

  return [...systemInfoServices.value.mac_addresses]
    .filter((mac) => mac.mac !== '00:00:00:00:00:00') // Filter out empty MAC addresses
    .sort((a, b) => {
      // Prioritize Ethernet interfaces
      const aIsEthernet = isEthernetInterface(a.interface)
      const bIsEthernet = isEthernetInterface(b.interface)

      if (aIsEthernet && !bIsEthernet) return -1
      if (!aIsEthernet && bIsEthernet) return 1

      // If both are the same type, sort by interface name
      return a.interface.localeCompare(b.interface)
    })
})

// Get the primary IPv4 address (prefer Ethernet interfaces)
const getPrimaryIPv4 = computed(() => {
  if (!systemInfoServices.value.networks) return systemInfoServices.value.ipv4 || 'No IP Address'

  // Find the first IPv4 address on an Ethernet interface
  const ethernetIPv4 = systemInfoServices.value.networks.find(
    (network) => isEthernetInterface(network.interface) && isIPv4(network.addr),
  )

  if (ethernetIPv4) return ethernetIPv4.addr

  // If no Ethernet IPv4, find any IPv4
  const anyIPv4 = systemInfoServices.value.networks.find((network) => isIPv4(network.addr))
  if (anyIPv4) return anyIPv4.addr

  return systemInfoServices.value.ipv4 || 'No IPv4 Address'
})

// Simplify the function sortSysInfoData
const sortSysInfoData = async () => {
  // No longer necessary to set systemInfoServices.value here
  // because it is handled by the watcher
}

// Add a watcher that reacts to changes in systemInfoData
watch(
  systemInfoData,
  async (newData) => {
    if (newData) {
      systemInfoServices.value = newData

      // Set default selections for network and MAC interface
      if (sortedNetworks.value.length > 0) {
        const network = sortedNetworks.value[0]
        selectedNetworkInterface.value = `${network.interface}-${network.addr}`
      }

      if (sortedMacAddresses.value.length > 0) {
        selectedMacInterface.value = sortedMacAddresses.value[0].interface
      }

      console.log('System Info updated:', systemInfoServices.value)
    }
  },
  { immediate: true }, // Call the callback immediately when the watcher is created
)

const getSelectedNetwork = computed(() => {
  if (!selectedNetworkInterface.value) return null

  const [interfaceName, addr] = selectedNetworkInterface.value.split('-')
  return systemInfoServices.value.networks?.find(
    (network) => network.interface === interfaceName && network.addr === addr,
  )
})

const getSelectedMacAddress = computed(() => {
  if (!systemInfoServices.value.mac_addresses || !selectedMacInterface.value) return null
  return systemInfoServices.value.mac_addresses.find(
    (mac) => mac.interface === selectedMacInterface.value,
  )
})

// Handlers
const handleRefetchSysInfo = async () => {
  try {
    await refetch()
    await sortSysInfoData()
  } catch (error) {
    console.error('Failed to refetch system info:', error)
  }
}

onMounted(() => {
  sortSysInfoData()
})
</script>

<style scoped>
@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-card {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-fade-in-left {
  animation: fade-in-left 0.8s ease-out forwards;
}

.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out forwards;
}

.animate-slide-in-card {
  animation: slide-in-card 0.8s ease-out forwards;
}
</style>
