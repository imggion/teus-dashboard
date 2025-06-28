<template>
  <section v-if="!isLoading">
    <div class="flex flex-row gap-2 mb-4">
      <h2
        class="text-xl font-semibold text-gray-200 opacity-0 animate-fade-in-title"
        style="animation-delay: 0.1s"
      >
        My Bookmarks
      </h2>
      <div
        class="flex flex-col justify-center opacity-0 animate-fade-in-edit"
        style="animation-delay: 0.2s"
      >
        <button
          @click.prevent="isDeletingState = !isDeletingState"
          class="bg-[#1e1e1e] rounded-xl p-2 flex items-center justify-center cursor-pointer relative overflow-hidden shadow-lg transition-all duration-300 transform hover:translate-y-[-3px] border border-gray-700/30 hover:border-amber-500/30 hover:shadow-amber-500/10 active:translate-y-[1px] hover:scale-105 group"
        >
          <Icon
            color="white"
            class="self-center my-auto transition-transform duration-300 group-hover:rotate-12"
            icon="hugeicons:edit-01"
          />
        </button>
      </div>
    </div>

    <div v-if="services.length > 0" class="flex flex-row flex-wrap gap-3">
      <template v-for="(service, index) in services" :key="index">
        <component
          :is="service.link ? 'a' : 'div'"
          :href="service.link"
          target="_blank"
          class="inline-block opacity-0 animate-bounce-in"
          :style="`animation-delay: ${0.3 + index * 0.1}s`"
        >
          <GridButton
            :is-deleting-state="isDeletingState"
            :button-index="index + 1"
            @long-press="handleLongPress"
            @edit-service="handleEditService(service)"
            @delete-service="handleDeleteService(service)"
          >
            <template #icon>
              <Icon color="white" class="size-7" :icon="service.icon || Icons.plus" />
            </template>
          </GridButton>
        </component>
      </template>

      <!-- Add button with animation -->
      <div
        class="opacity-0 animate-bounce-in"
        :style="`animation-delay: ${0.3 + services.length * 0.1}s`"
      >
        <GenericButton @click="handleOpenNewServiceModal">
          <template #icon>
            <Icon color="white" class="size-7" :icon="Icons.plus" />
          </template>
        </GenericButton>
      </div>
    </div>

    <div
      v-else
      class="flex flex-row flex-wrap justify-center gap-3 opacity-0 animate-fade-in"
      style="animation-delay: 0.3s"
    >
      <div class="text-center text-xs self-center text-gray-400">No preferred services found</div>
      <button
        @click="handleOpenNewServiceModal"
        :class="[
          'text-center flex flex-row items-center justify-center gap-1 cursor-pointer',
          'text-xs border border-neutral-700/80',
          'shadow text-gray-300 py-1 px-2',
          'bg-[#2e2e2e] hover:bg-[#3e3e3e] active:bg-[#4e4e4e] transition-all duration-300 rounded-lg',
          'hover:scale-105 active:scale-95 hover:shadow-lg group',
        ]"
      >
        <Icon :icon="Icons.plus" class="transition-transform duration-200 group-hover:rotate-90" />
        <span class="transition-transform duration-200 group-hover:translate-x-1">Add</span>
      </button>
    </div>

    <div
      v-else
      class="flex flex-row flex-wrap justify-center gap-3 opacity-0 animate-fade-in"
      style="animation-delay: 0.3s"
    >
      <div class="text-center text-xs self-center text-gray-400">Loading bookmarks...</div>
    </div>

    <div
      v-if="isError"
      class="flex flex-row flex-wrap justify-center gap-3 opacity-0 animate-fade-in"
      style="animation-delay: 0.3s"
    >
      <div class="text-center text-xs self-center text-gray-400">Error loading bookmarks</div>
    </div>
  </section>

  <!-- Modals with enhanced transitions -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <NewServiceModal
      v-if="isNewServiceModalOpen"
      :is-open="isNewServiceModalOpen"
      @service-added="handleServiceAdded"
      @close="handleCloseNewServiceModal"
    />
  </Transition>

  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <EditServiceModal
      v-if="selectedService && isEditServiceModalOpen"
      :is-open="isEditServiceModalOpen"
      :service="selectedService as ServicesPureSchema"
      @close="handleCloseEditServiceModal"
      @service-modified="handleServiceModified"
    />
  </Transition>

  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <DeleteConfirmationModal
      v-if="selectedService && isDeleteConfirmationModalOpen"
      :is-open="isDeleteConfirmationModalOpen"
      :service-id="selectedService.id"
      @close="handleServiceDeleted"
      @service-deleted="handleServiceDeleted"
    />
  </Transition>
</template>

<script setup lang="ts">
import GridButton from '@/components/GridButton.vue'
import { computed, ref } from '@vue/runtime-core'
import { useServicesStore } from '@/stores/services'
import NewServiceModal from '@/components/modals/NewServiceModal.vue'
import EditServiceModal from '@/components/modals/EditServiceModal.vue'
import DeleteConfirmationModal from './modals/DeleteConfirmationModal.vue'
import type { ServicePayload, ServicesPureSchema } from '@/types/Services'
import { Icons } from '@/configs/Icons'
import GenericButton from './generics/GenericButton.vue'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { bookmarkServices } from '@/services/BookmarkServices'

// Definitions
const services = computed(() => bookmarks.value as ServicesPureSchema[])

const {
  data: bookmarks,
  refetch: refetchBookmarks,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ['bookmarks'],
  queryFn: () => bookmarkServices.getBookmarks(),
  retry: 2,
  refetchOnWindowFocus: false,
})

// States
const isNewServiceModalOpen = ref(false)
const isDeletingState = ref(false)
const isEditServiceModalOpen = ref(false)
const isDeleteConfirmationModalOpen = ref(false)
const selectedService = ref<ServicePayload | null>(null)

// Handlers
const handleLongPress = () => {
  isDeletingState.value = !isDeletingState.value
}

const handleServiceAdded = (service: ServicesPureSchema) => {
  isNewServiceModalOpen.value = false
  refetchBookmarks()
}

const handleOpenNewServiceModal = () => {
  isNewServiceModalOpen.value = true
}

const handleCloseNewServiceModal = () => {
  isNewServiceModalOpen.value = false
}

const handleEditService = (service: ServicesPureSchema) => {
  selectedService.value = service
  isEditServiceModalOpen.value = true
}

const handleDeleteService = (service: ServicesPureSchema) => {
  selectedService.value = service
  isDeleteConfirmationModalOpen.value = true
}

const handleCloseEditServiceModal = () => {
  isEditServiceModalOpen.value = false
}

const handleServiceModified = () => {
  isEditServiceModalOpen.value = false
  refetchBookmarks()
}

const handleServiceDeleted = () => {
  isDeleteConfirmationModalOpen.value = false
  refetchBookmarks()
}
</script>

<style scoped>
@keyframes fade-in-title {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-edit {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-title {
  animation: fade-in-title 0.8s ease-out forwards;
}

.animate-fade-in-edit {
  animation: fade-in-edit 0.8s ease-out forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
