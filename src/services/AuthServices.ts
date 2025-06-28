import useAxios from '@/composables/useAxios'
import AxiosClass from '@/configs/Axios'
import type { Claims } from '@/types/Claims'

export interface LoginPayload {
  username: string
  password: string
}

const axios = AxiosClass.getInstance()
export const authServices = {
  async login(payload: LoginPayload): Promise<Claims> {
    try {
      const response = await axios.post('/auth/login', payload)
      return response.data as Claims
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async signup(payload: LoginPayload): Promise<string> {
    try {
      const response = await axios.post('/auth/signup', payload)
      return response.data.username
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  async isAuth(): Promise<boolean> {
    try {
      const response = await axios.post('/teus/check')
      return response.status !== 401 && response.status !== 403
    } catch (error: any) {
      // If the error is 401 or 403, user is not authenticated
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false
      }
      // For other errors, also return false but log them
      console.error('Check auth error:', error)
      return false
    }
  },
}
