<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center">
        <!-- Backdrop with blur -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            class="bg-[#1e1e1e] rounded-3xl shadow-xl w-full max-w-md mx-4 text-white border border-neutral-700/30 relative z-10"
          >
            <!-- Header -->
            <div class="flex justify-between items-center p-4">
              <h2 class="text-xl font-semibold">How to login?</h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-4 pb-4">
              <!-- Content -->
              <div class="mb-5">
                <span>To get your login credentials, you can go to:</span>
              </div>
              <!-- Buttons -->
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="cursor-pointer px-4 py-2 text-xs font-medium text-gray-300 bg-red-700/30 border border-neutral-700/80 rounded-xl hover:bg-red-700/40 focus:outline-none focus:ring-1 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useServicesStore } from '@/stores/services'

type EditServiceModalProps = {
  isOpen: boolean
}

// Props
const { isOpen } = defineProps<EditServiceModalProps>()

// Emits
const emit = defineEmits(['close', 'service-deleted'])
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.icon-smaller :deep(svg) {
  min-width: 32px;
  min-height: 32px;
  width: 32px !important;
  height: 32px !important;
  overflow: visible;
}

/* Per le icone nella griglia del selettore */
.grid .icon-smaller :deep(svg) {
  transform: scale(0.75);
  transform-origin: center;
}
</style>
