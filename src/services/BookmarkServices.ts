import AxiosClass from '@/configs/Axios'
import type { ServicePayload, ServicesPureSchema } from '@/types/Services'

const axios = AxiosClass.getInstance()
export const bookmarkServices = {
  async getBookmarks(): Promise<ServicesPureSchema[]> {
    try {
      const response = await axios.get<ServicesPureSchema[]>('/teus/bookmarks')
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async createBookmark(payload: ServicePayload): Promise<ServicesPureSchema[]> {
    try {
      const response = await axios.post<ServicesPureSchema[]>('/teus/bookmarks', payload)
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async updateBookmark(id: string, payload: ServicePayload): Promise<ServicesPureSchema[]> {
    try {
      const response = await axios.patch<ServicesPureSchema[]>(`/teus/bookmarks/${id}`, payload)
      return response.data
    } catch (error) {
      console.error('Update bookmark error:', error)
      throw error
    }
  },

  async deleteBookmark(id: string): Promise<ServicesPureSchema[]> {
    try {
      const response = await axios.delete<ServicesPureSchema[]>(`/teus/bookmarks/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete bookmark error:', error)
      throw error
    }
  },
}
