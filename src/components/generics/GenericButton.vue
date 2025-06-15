<template>
  <div
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    v-ripple
    :class="[
      'w-[70px] h-[70px] bg-[#1e1e1e] rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden shadow-lg transition-all duration-300 transform border border-gray-700/30 group',
      'hover:translate-y-[-3px] hover:border-purple-500/30 hover:shadow-purple-500/10 hover:shadow-xl',
      'active:translate-y-[1px] active:scale-95',
      isHovered ? 'scale-105' : 'opacity-70 scale-100',
    ]"
  >
    <!-- Background gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>

    <!-- Icon container with enhanced hover effect -->
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 group-hover:scale-110"
    >
      <slot name="icon"></slot>
    </div>

    <!-- Subtle pulse effect on hover -->
    <div
      class="absolute inset-0 rounded-2xl border border-purple-400/0 group-hover:border-purple-400/20 transition-all duration-500 animate-pulse-ring opacity-0 group-hover:opacity-100"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type CallbackFn = (...args: any[]) => void

const props = defineProps<{
  onClick?: CallbackFn
  onHover?: CallbackFn
}>()

const isHovered = ref(false)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'hover', index: number | null): void
}>()

const handleClick = (event: MouseEvent) => {
  props.onClick?.(event)
  emit('click', event)
}

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}
</script>

<style scoped>
.button-ripple {
  position: absolute;
  background: rgba(139, 92, 246, 0.4);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-in-out infinite;
}
</style>
