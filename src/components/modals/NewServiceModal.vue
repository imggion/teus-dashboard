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
              <h2 class="text-xl font-semibold">Add new service</h2>
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
                <!-- Name -->
                <div class="mb-5">
                  <label for="name" class="block text-xs font-medium text-gray-300 mb-2"
                    >Service name</label
                  >
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    required
                    placeholder="Portainer"
                    class="w-full px-3 py-2 bg-[#2a2a2a] text-xs border border-neutral-700/80 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
                  />
                </div>

                <!-- Link -->
                <div class="mb-5">
                  <label for="link" class="block text-xs font-medium text-gray-300 mb-2"
                    >Link</label
                  >
                  <input
                    id="link"
                    v-model="formData.link"
                    type="url"
                    placeholder="https://portainer.example.com"
                    class="w-full text-xs px-3 py-2 bg-[#2a2a2a] border border-neutral-700/80 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
                  />
                </div>

                <!-- Icon -->
                <div class="mb-7">
                  <label for="icon" class="block text-xs font-medium text-gray-300 mb-2"
                    >Icon</label
                  >

                  <div class="relative">
                    <div
                      @click="showIconPicker = !showIconPicker"
                      class="w-full px-3 py-2 bg-[#2a2a2a] text-xs border border-neutral-700/80 rounded-xl shadow-sm focus:outline-none cursor-pointer flex items-center justify-between"
                    >
                      <div class="flex items-center gap-2">
                        <div
                          class="flex items-center justify-center flex-shrink-0 overflow-visible"
                        >
                          <Icon
                            v-if="formData.icon"
                            :icon="getIconByName(formData.icon)"
                            class="size-5"
                          />
                        </div>
                        <span v-if="formData.icon" class="truncate">{{ formData.icon }}</span>
                        <span v-else class="text-gray-500">Select an icon</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path fill="currentColor" d="m12 15l-5-5h10l-5 5Z" />
                      </svg>
                    </div>

                    <!-- Icon Picker -->
                    <Transition
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="opacity-0 scale-95"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition-all duration-150 ease-in"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-95"
                    >
                      <div
                        v-if="showIconPicker"
                        class="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-neutral-700/80 rounded-xl shadow-lg p-4"
                      >
                        <div class="mb-2">
                          <input
                            v-model="iconSearch"
                            type="text"
                            placeholder="Search icons..."
                            class="w-full px-3 py-2 bg-[#2a2a2a] text-xs border border-neutral-700/80 rounded-xl"
                          />
                        </div>

                        <div class="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto px-1 py-2">
                          <Icon
                            v-for="(icon, name) in filteredIcons"
                            :key="name"
                            :icon="icon"
                            @click="selectIcon(name)"
                            :class="[
                              'flex flex-col items-center justify-center size-8 p-1 rounded-lg cursor-pointer transition-all',
                              formData.icon === name
                                ? 'bg-purple-500/20 border border-purple-500/50'
                                : 'hover:bg-[#2a2a2a] border border-transparent',
                            ]"
                          />
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>

                <!-- Buttons -->
                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeModal"
                    class="cursor-pointer px-4 py-2 text-xs font-medium text-gray-300 bg-red-700/30 border border-neutral-700/80 rounded-xl hover:bg-red-700/40 focus:outline-none focus:ring-1 transition-all"
                  >
                    Cancel
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
                      Saving...
                    </span>
                    <span v-else>Save</span>
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
import { ref, reactive, computed } from 'vue'
import { useServicesStore } from '@/stores/services'
import type { ServicesSchema } from '@/types/Services'
import { Icons } from '@/configs/Icons'
import { Icon } from '@iconify/vue'
// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['close', 'service-added'])

// Store
const servicesStore = useServicesStore()
const loading = ref(false)

// Form data
const formData = reactive<ServicesSchema>({
  name: '',
  link: null,
  icon: '',
})

const showIconPicker = ref(false)
const iconSearch = ref('')

const closeModal = () => {
  emit('close')
}

const resetForm = () => {
  formData.name = ''
  formData.link = null
  formData.icon = ''
}

const submitForm = async () => {
  loading.value = true
  try {
    const newService = servicesStore.addService({
      name: formData.name,
      link: formData.link,
      icon: formData.icon,
    })

    resetForm()
    emit('service-added', newService)
    closeModal()
  } catch (error) {
    console.error('Error during service saving:', error)
  } finally {
    loading.value = false
  }
}

// Ottieni l'icona tramite il nome dalla collezione Icons
const getIconByName = (name: string) => {
  return Icons[name as keyof typeof Icons] || ''
}

// Seleziona un'icona e chiudi il selettore
const selectIcon = (name: string) => {
  formData.icon = name
  showIconPicker.value = false
}

// Filtra le icone in base alla ricerca
const filteredIcons = computed(() => {
  if (!iconSearch.value) {
    return Icons
  }

  const searchTerm = iconSearch.value.toLowerCase()
  const result: Record<string, string> = {}

  Object.entries(Icons).forEach(([key, value]) => {
    if (key.toLowerCase().includes(searchTerm)) {
      result[key] = value
    }
  })

  return result
})
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
