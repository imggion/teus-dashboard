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
              <h2 class="text-xl font-semibold">Delete service</h2>
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
              <form @submit.prevent="submitForm">
                <!-- Content -->
                <div class="mb-5">
                  <span>Are you sure you want to delete this service?</span>
                </div>
                <!-- Buttons -->
                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeModal"
                    class="cursor-pointer px-4 py-2 text-xs font-medium text-gray-300 bg-red-700/30 border border-neutral-700/80 rounded-xl hover:bg-red-700/40 focus:outline-none focus:ring-1 transition-all"
                  >
                    No
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="cursor-pointer px-4 py-2 text-xs font-medium text-white bg-[#2e2e2e] border border-neutral-700/80 hover:bg-[#3e3e3e] active:bg-[#4e4e4e] rounded-xl focus:outline-none focus:ring-1 disabled:cursor-not-allowed transition-all"
                  >
                    <span v-if="loading">
                      <svg
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </span>
                    <span v-else>Yes</span>
                  </button>
                </div>
              </form>
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
  serviceId?: string
}

// Props
const { isOpen, serviceId } = defineProps<EditServiceModalProps>()

// Emits
const emit = defineEmits(['close', 'service-deleted'])

// Store
const servicesStore = useServicesStore()
const loading = ref(false)

const closeModal = () => {
  emit('close')
}

const submitForm = async () => {
  loading.value = true
  try {
    if (serviceId) servicesStore.deleteService(serviceId)
    emit('service-deleted')
    closeModal()
  } catch (error) {
    console.error('Error during service saving:', error)
  } finally {
    loading.value = false
  }
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
