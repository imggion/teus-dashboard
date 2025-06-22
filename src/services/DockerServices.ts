import AxiosClass from '@/configs/Axios'
import type { TeusConfigSchema } from '@/types/Config'
import type { Containers, DockerVersion } from '@/types/Docker'

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

  async getContainers(all = false): Promise<Containers> {
    try {
      const response = await axios.get<Containers>(`/teus/docker/containers?all=${all}`)
      return response.data
    } catch (error) {
      console.error('Error fetching Docker containers:', error)
      throw error
    }
  },

  async getDockerVersion(): Promise<DockerVersion> {
    try {
      const response = await axios.get<DockerVersion>('/teus/docker/version')
      return response.data
    } catch (error) {
      console.error('Error fetching Docker version:', error)
      throw error
    }
  },
}
