import useAxios from '@/composables/useAxios'
import AxiosClass from '@/configs/Axios'
import type { GenericSysinfoSchema } from '@/types/Sysinfo'

const axios = AxiosClass.getInstance()
const genericSystemServices = {
  getSystemInfo: async () => {
    try {
      const response = await axios.get('/teus/generic/sysinfo')
      if (!response || !response.data) {
        throw new Error('Invalid response from system API')
      }
      return response.data as GenericSysinfoSchema
    } catch (error) {
      console.error('Error fetching system information:', error)
      throw error
    }
  },
}

export default genericSystemServices
