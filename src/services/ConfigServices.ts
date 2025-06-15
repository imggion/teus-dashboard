import AxiosClass from '@/configs/Axios'
import type { TeusConfigSchema } from '@/types/Config'

const axios = AxiosClass.getInstance()
export const configServices = {
  async isFirstLogin(): Promise<TeusConfigSchema> {
    try {
      const response = await axios.get<TeusConfigSchema>('/auth/teus-config')
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
}
