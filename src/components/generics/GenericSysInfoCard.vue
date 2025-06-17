<template>
  <div class="bg-[#121212] rounded-xl p-4 border border-gray-700/20 h-full flex flex-col">
    <div class="flex w-full items-center mb-2">
      <div class="text-purple-400 mr-2">
        <Icon class="self-center my-auto" :icon="computedIcon" />
      </div>
      <span class="text-gray-400 text-sm">{{ title }}</span>
      <div class="ml-auto">
        <slot name="end-element" />
      </div>
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IconName, Icons } from '@/configs/Icons'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { computed } from 'vue'

interface GenericSysInfoCardProps {
  title: string
  icon: IconName
}
const { title, icon } = defineProps<GenericSysInfoCardProps>()
const computedIcon = computed(() => Icons[icon])
</script>
