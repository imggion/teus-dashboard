import useAxios from '@/composables/useAxios'
import AxiosClass from '@/configs/Axios'
import type { SystemSchema } from '@/types/Sysinfo'
import { type AxiosInstance } from 'axios'

type CallbackFunction = (data?: SystemSchema) => void

export class SystemServices {
  private static instance: SystemServices | null = null
  private intervalId = 0
  private pollingActivated = true
  private pollingInterval = 3000 // Reduced from 5000ms for better responsiveness
  private axios!: AxiosInstance // Use definite assignment assertion
  private callbacks: Set<CallbackFunction> = new Set()
  private lastData: SystemSchema | null = null
  private isPolling = false

  constructor() {
    // Implement singleton pattern to prevent multiple polling instances
    if (SystemServices.instance) {
      return SystemServices.instance
    }

    this.axios = AxiosClass.getInstance()
    SystemServices.instance = this
  }

  static getInstance(): SystemServices {
    if (!SystemServices.instance) {
      SystemServices.instance = new SystemServices()
    }
    return SystemServices.instance
  }

  async getSystemInfo(): Promise<SystemSchema> {
    try {
      const response = await this.axios.get<SystemSchema>('/teus/sysinfo')

      if (!response || !response.data) {
        throw new Error('Invalid response from system API')
      }

      return response.data
    } catch (error) {
      console.error('Error fetching system information:', error)
      throw error
    }
  }

  startPolling(callback: CallbackFunction) {
    // Add callback to the set
    this.callbacks.add(callback)

    // If already polling, just add the callback and return
    if (this.isPolling) {
      // Send last known data immediately if available
      if (this.lastData) {
        callback(this.lastData)
      }
      return
    }

    if (this.pollingActivated) {
      this.isPolling = true

      // Initial fetch
      this.getSystemInfo()
        .then((data) => {
          this.lastData = data
          this.notifyCallbacks(data)
        })
        .catch((error) => {
          console.warn('Initial system info fetch failed:', error)
        })

      // Set up interval for subsequent fetches
      this.intervalId = setInterval(() => {
        this.getSystemInfo()
          .then((data) => {
            this.lastData = data
            this.notifyCallbacks(data)
          })
          .catch((error) => {
            console.warn('System info polling failed:', error)
          })
      }, this.pollingInterval)
    }
  }

  private notifyCallbacks(data: SystemSchema) {
    // Notify all registered callbacks
    this.callbacks.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.warn('Callback execution failed:', error)
      }
    })
  }

  stopPolling(callback?: CallbackFunction) {
    if (callback) {
      // Remove specific callback
      this.callbacks.delete(callback)

      // If no more callbacks, stop polling
      if (this.callbacks.size === 0) {
        this.stopAllPolling()
      }
    } else {
      // Stop all polling
      this.stopAllPolling()
    }
  }

  private stopAllPolling() {
    if (this.isPolling && this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = 0
      this.isPolling = false
    }
    this.callbacks.clear()
  }

  // Method to clean up the singleton instance
  static destroy() {
    if (SystemServices.instance) {
      SystemServices.instance.stopAllPolling()
      SystemServices.instance = null
    }
  }
}
