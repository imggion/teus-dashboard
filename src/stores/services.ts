import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { ServicesSchema } from '@/types/Services'
import { Icons } from '@/configs/Icons'

export const useServicesStore = defineStore('services', () => {
  const services = ref<ServicesSchema[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load services from localStorage on initialization
  const initializeStore = () => {
    loading.value = true
    try {
      const storedServices = localStorage.getItem('services')
      if (storedServices) {
        services.value = JSON.parse(storedServices)
      }
    } catch (err) {
      console.error('Error loading services from localStorage:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load services'
    } finally {
      loading.value = false
    }
  }

  // Save services to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('services', JSON.stringify(services.value))
      return true
    } catch (err) {
      console.error('Error saving services to localStorage:', err)
      error.value = err instanceof Error ? err.message : 'Failed to save services'
      return false
    }
  }

  // Create a new service
  const addService = (service: Omit<ServicesSchema, 'id'>) => {
    const newService: ServicesSchema = {
      id: uuidv4(),
      ...service,
    }
    newService.icon = Icons[service.icon as keyof typeof Icons]
    services.value.push(newService)
    saveToLocalStorage()
    return newService
  }

  // Get a service by ID
  const getServiceById = (id: string) => {
    return services.value.find((service) => service.id === id) || null
  }

  // Update a service
  const updateService = (id: string, updatedService: Partial<ServicesSchema>) => {
    const index = services.value.findIndex((service) => service.id === id)
    if (index !== -1) {
      services.value[index] = { ...services.value[index], ...updatedService }
      saveToLocalStorage()
      return services.value[index]
    }
    return null
  }

  // Delete a service
  const deleteService = (id: string) => {
    const index = services.value.findIndex((service) => service.id === id)
    if (index !== -1) {
      services.value.splice(index, 1)
      saveToLocalStorage()
      return true
    }
    return false
  }

  // Get all services
  const getAllServices = computed(() => services.value)

  // Initialize the store
  initializeStore()

  return {
    services,
    loading,
    error,
    addService,
    getServiceById,
    updateService,
    deleteService,
    getAllServices,
    initializeStore,
  }
})
