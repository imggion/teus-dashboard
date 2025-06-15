import useAxios from '@/composables/useAxios'
import AxiosClass from '@/configs/Axios'
import type { SystemSchema } from '@/types/Sysinfo'
import { type AxiosInstance } from 'axios'

type CallbackFunction<T = unknown> = (data?: T) => void

export class SystemServices {
  intervalId = 0
  pollingActivated = true
  pollingInterval = 5_000
  axios: AxiosInstance

  constructor() {
    const axios = AxiosClass.getInstance()
    this.axios = axios
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
    if (this.pollingActivated) {
      this.getSystemInfo().then(callback)
      this.intervalId = setInterval(() => {
        this.getSystemInfo().then(callback)
      }, this.pollingInterval)
    }
  }

  stopPolling() {
    if (this.pollingActivated) {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = 0
      }
    }
  }
}
