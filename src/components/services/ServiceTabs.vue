<template>
  <div>
    <div class="border-b border-gray-700/30 mb-6">
      <ul class="flex flex-wrap -mb-px">
        <li v-for="(tab, index) in tabs" :key="index" class="mr-2">
          <button
            @click="activeTab = tab.id"
            :class="[
              'inline-block p-4 rounded-t-lg',
              activeTab === tab.id
                ? 'text-purple-400 border-b-2 border-purple-400 active'
                : 'text-gray-400 hover:text-gray-300 hover:border-gray-300 border-b-2 border-transparent',
            ]"
          >
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 flex items-center justify-center">
                <Icon :icon="tab.icon" class="transform-origin-center" />
              </div>
              {{ tab.name }}
            </div>
          </button>
        </li>
      </ul>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'systemd'" class="tab-pane">
        <SystemdServiceList />
      </div>
      <div v-if="activeTab === 'docker'" class="tab-pane">
        <DockerContainerList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icons } from '@/configs/Icons'
import SystemdServiceList from '@/components/services/SystemdServiceList.vue'
import DockerContainerList from '@/components/services/DockerContainerList.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'

const activeTab = ref('systemd')

const tabs = [
  {
    id: 'systemd',
    name: 'System Services',
    icon: Icons.system,
  },
  {
    id: 'docker',
    name: 'Docker Containers',
    icon: Icons.docker,
  },
]
</script>
