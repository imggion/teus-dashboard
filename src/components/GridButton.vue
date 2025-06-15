<template>
  <button
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mousedown="startPress"
    @mouseup="endPress"
    @mouseleave="cancelAll"
    @touchstart.prevent="startPress"
    @touchend="endPress"
    @touchcancel="cancelAll"
    v-ripple
    :class="[
      'w-[70px] h-[70px] bg-[#1e1e1e] rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden shadow-lg transition-all duration-300 transform border border-gray-700/30 group',
      'hover:translate-y-[-3px] hover:border-purple-500/30 hover:shadow-purple-500/10 hover:shadow-xl',
      'active:translate-y-[1px] active:scale-95',
      isHovered ? 'scale-105' : 'opacity-70 scale-100',
      isDeletingState && 'hover:border-red-500/30 hover:shadow-red-500/10 shake',
      isPressed && 'scale-95',
    ]"
  >
    <!-- Background gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>

    <!-- Icon container with loading state -->
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300"
    >
      <div
        class="transition-all duration-300 group-hover:scale-110"
        :class="isLoading ? 'opacity-50 scale-90' : ''"
      >
        <slot name="icon"></slot>
      </div>

      <!-- Loading spinner -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <div
          class="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"
        ></div>
      </div>
    </div>

    <!-- Edit button with smooth positioning -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-75 rotate-180"
      enter-to-class="opacity-100 scale-100 rotate-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 scale-100 rotate-0"
      leave-to-class="opacity-0 scale-75 rotate-180"
    >
      <div v-if="isDeletingState" class="absolute top-1 left-1 z-40">
        <div class="w-4 h-4 rounded-full flex items-center justify-center">
          <button
            class="cursor-pointer p-1 rounded-full bg-black/20 backdrop-blur-sm hover:bg-amber-500/20 transition-all duration-200"
            @click.prevent="handleEditService"
          >
            <Icon
              :icon="Icons.edit"
              class="w-3 h-3 text-gray-400 hover:text-amber-400 transition-colors duration-200"
            />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Delete button with smooth positioning -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-75 rotate-180"
      enter-to-class="opacity-100 scale-100 rotate-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 scale-100 rotate-0"
      leave-to-class="opacity-0 scale-75 rotate-180"
    >
      <div v-if="isDeletingState" class="absolute top-1 right-1 z-40">
        <div class="w-4 h-4 rounded-full flex items-center justify-center">
          <button
            class="cursor-pointer p-1 rounded-full bg-black/20 backdrop-blur-sm hover:bg-red-500/20 transition-all duration-200"
            @click.prevent="handleDeleteService"
          >
            <Icon
              :icon="Icons.delete"
              class="w-3 h-3 text-gray-400 hover:text-red-400 transition-colors duration-200"
            />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Progress ring for long press -->
    <svg
      v-if="longPressProgress > 0"
      class="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        class="text-purple-400/30"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        class="text-purple-400"
        :stroke-dasharray="62.83"
        :stroke-dashoffset="62.83 * (1 - longPressProgress)"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icons } from '@/configs/Icons'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  buttonIndex: number
  isDeletingState?: boolean
  isLoading?: boolean
}>()

const isHovered = ref(false)
const isPressed = ref(false)
const longPressProgress = ref(0)
let longPressTimer = null as number | null
let progressTimer = null as number | null
let pressStartTime = 0
let longPressFired = false

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'hover', index: number | null): void
  (e: 'long-press'): void
  (e: 'delete-service'): void
  (e: 'edit-service'): void
}>()

const handleClick = (event: MouseEvent) => {
  if (longPressFired) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const pressDuration = Date.now() - pressStartTime
  if (pressDuration > 500) {
    return
  }

  // Enhanced feedback with better audio context handling
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.frequency.value = 220 + props.buttonIndex * 30
    gainNode.gain.value = 0.05 // Reduced volume for better UX
    oscillator.type = 'sine'
    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2)
    oscillator.stop(audioCtx.currentTime + 0.2)
  } catch (error) {
    // Silently handle audio context errors
    console.debug('Audio feedback not available')
  }

  // Smoother background color transition
  const hue = Math.floor(Math.random() * 360)
  const saturation = Math.floor(Math.random() * 20) + 10 // 10-30%
  const lightness = Math.floor(Math.random() * 3) + 7 // 7-10%

  document.body.style.transition = 'background-color 0.8s ease-out'
  document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`

  setTimeout(() => {
    document.body.style.backgroundColor = ''
    setTimeout(() => {
      document.body.style.transition = ''
    }, 800)
  }, 1200)

  emit('click', event)
}

const handleMouseEnter = () => {
  isHovered.value = true
  emit('hover', props.buttonIndex)
}

const handleMouseLeave = () => {
  isHovered.value = false
  emit('hover', null)
}

const startPress = (event: MouseEvent | TouchEvent) => {
  isPressed.value = true
  pressStartTime = Date.now()
  longPressFired = false
  longPressProgress.value = 0

  // Start progress animation
  const startTime = Date.now()
  const duration = 700

  const updateProgress = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    longPressProgress.value = progress

    if (progress < 1) {
      progressTimer = requestAnimationFrame(updateProgress)
    }
  }

  progressTimer = requestAnimationFrame(updateProgress)

  longPressTimer = window.setTimeout(() => {
    longPressFired = true
    emit('long-press')
  }, duration)
}

const endPress = (event: MouseEvent | TouchEvent) => {
  isPressed.value = false

  if (longPressTimer !== null) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }

  if (progressTimer !== null) {
    cancelAnimationFrame(progressTimer)
    progressTimer = null
  }

  // Smooth progress reset
  const resetProgress = () => {
    longPressProgress.value = Math.max(0, longPressProgress.value - 0.1)
    if (longPressProgress.value > 0) {
      requestAnimationFrame(resetProgress)
    }
  }
  requestAnimationFrame(resetProgress)
}

const cancelAll = () => {
  isPressed.value = false

  if (longPressTimer !== null) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }

  if (progressTimer !== null) {
    cancelAnimationFrame(progressTimer)
    progressTimer = null
  }

  longPressFired = false

  // Smooth progress reset
  const resetProgress = () => {
    longPressProgress.value = Math.max(0, longPressProgress.value - 0.1)
    if (longPressProgress.value > 0) {
      requestAnimationFrame(resetProgress)
    }
  }
  requestAnimationFrame(resetProgress)
}

const handleDeleteService = () => {
  emit('delete-service')
}

const handleEditService = () => {
  emit('edit-service')
}
</script>

<style scoped>
.shake {
  animation: wiggle 0.2s ease-in-out infinite;
  transform-origin: center center;
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-1deg);
  }
  75% {
    transform: rotate(1deg);
  }
}

.button-ripple {
  position: absolute;
  background: rgba(139, 92, 246, 0.3);
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
</style>
