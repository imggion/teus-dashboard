<template>
  <div
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    v-ripple
    :class="[
      `hover:${computedShadowClass}`,
      'bg-[#1e1e1e] rounded-xl p-4 flex items-center justify-center cursor-pointer relative overflow-hidden shadow-lg transition-all duration-300 transform hover:translate-y-[-3px] border border-gray-700/30 hover:border-purple-500/30 ',
      isHovered ? '' : 'opacity-70',
    ]"
  >
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/runtime-core'

type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'success'
  | 'info'
  | 'light'
  | 'dark'

type CallbackFn = (...args: any[]) => void

const buttonVariants = {
  primary: 'bg-purple-500',
  secondary: 'bg-gray-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  success: 'bg-green-500',
}

const buttonShadowVariants = {
  primary: 'shadow-purple-500/10',
  secondary: 'shadow-gray-500/10',
  warning: 'shadow-yellow-500/10',
  danger: 'shadow-red-500/10',
  success: 'shadow-green-500/10',
}

const computedShadowClass = computed(() => {
  return buttonShadowVariants[(props.variant as keyof typeof buttonShadowVariants) || 'primary']
})

const props = defineProps<{
  onClick?: CallbackFn
  onHover?: CallbackFn
  variant?: ButtonVariants
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
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
