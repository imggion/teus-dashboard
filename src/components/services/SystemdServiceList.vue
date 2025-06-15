<template>
  <div class="systemd-services">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-200">System Services</h2>
      <div class="flex gap-2">
        <button
          class="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
        >
          <span>Refresh</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="mb-4">
      <input
        type="text"
        placeholder="Search services..."
        class="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
      />
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-700/30">
      <table class="min-w-full divide-y divide-gray-700/30">
        <thead class="bg-[#1a1a1a]">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-[#2a2a2a] divide-y divide-gray-700/30">
          <tr v-for="service in services" :key="service.name" class="hover:bg-[#333333]">
            <td class="px-4 py-3 whitespace-nowrap">
              <div
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  service.status === 'running'
                    ? 'bg-green-100/10 text-green-400'
                    : service.status === 'stopped'
                      ? 'bg-red-100/10 text-red-400'
                      : 'bg-yellow-100/10 text-yellow-400',
                ]"
              >
                <span class="flex items-center">
                  <span
                    :class="[
                      'flex-shrink-0 h-2 w-2 rounded-full mr-1.5',
                      service.status === 'running'
                        ? 'bg-green-400'
                        : service.status === 'stopped'
                          ? 'bg-red-400'
                          : 'bg-yellow-400',
                    ]"
                  ></span>
                  {{ service.status }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
              {{ service.name }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
              {{ service.description }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400 text-right">
              <div class="flex justify-end space-x-2">
                <button
                  v-if="service.status !== 'running'"
                  class="text-green-400 hover:text-green-300"
                  title="Start"
                >
                  <Icon :icon="Icons.play" class="w-5 h-5" />
                </button>
                <button
                  v-if="service.status === 'running'"
                  class="text-red-400 hover:text-red-300"
                  title="Stop"
                >
                  <Icon :icon="Icons.stop" class="w-5 h-5" />
                </button>
                <button class="text-yellow-400 hover:text-yellow-300" title="Restart">
                  <Icon :icon="Icons.restart" class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icons } from '@/configs/Icons'
import { Icon } from '@iconify/vue/dist/iconify.js'

// Mock data for services
const services = ref([
  {
    name: 'nginx.service',
    status: 'running',
    description: 'A high performance web server and reverse proxy server',
  },
  {
    name: 'postgresql.service',
    status: 'running',
    description: 'PostgreSQL database server',
  },
  {
    name: 'mongodb.service',
    status: 'stopped',
    description: 'MongoDB document database',
  },
  {
    name: 'redis.service',
    status: 'running',
    description: 'Advanced key-value store',
  },
  {
    name: 'ssh.service',
    status: 'running',
    description: 'OpenSSH server daemon',
  },
  {
    name: 'apache2.service',
    status: 'failed',
    description: 'The Apache HTTP Server',
  },
  {
    name: 'mysql.service',
    status: 'running',
    description: 'MySQL database server',
  },
  {
    name: 'cron.service',
    status: 'running',
    description: 'Regular background program processing daemon',
  },
])
</script>
