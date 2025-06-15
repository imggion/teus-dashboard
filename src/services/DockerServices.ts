import AxiosClass from '@/configs/Axios'
import type { TeusConfigSchema } from '@/types/Config'
import type { Containers } from '@/types/Docker'

const axios = AxiosClass.getInstance()
export const dockerServices = {
  async isFirstLogin(): Promise<TeusConfigSchema> {
    try {
      const response = await axios.get<TeusConfigSchema>('/auth/teus-config')
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async getContainers(): Promise<Containers> {
    try {
      const response = await axios.get<Containers>('/teus/docker/containers')
      return response.data
    } catch (error) {
      console.error('Error fetching Docker containers:', error)
      throw error
    }
  },
}
