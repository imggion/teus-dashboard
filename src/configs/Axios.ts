import { TokenManager } from '@/managers/TokenManager'
import axios, { type AxiosInstance } from 'axios'

/**
 * @class AxiosClass
 * @description Singleton class that provides a centralized Axios instance for the application.
 * Implements the singleton pattern to ensure only one instance exists across the app.
 *
 * @example
 * // Get the Axios instance with a custom base URL
 * const apiClient = AxiosClass.getInstance();
 *
 * // Use the instance
 * apiClient.get('/endpoint');
 *
 * @property {AxiosInstance} axiosInstance - The Axios instance for making HTTP requests
 */
class AxiosClass {
  private static instance: AxiosClass | null = null
  private static baseUrl: string = import.meta.env.VITE_API_BASE_URL || ''
  private axiosInstance: AxiosInstance

  /**
   * Private constructor to prevent direct instantiation
   * @param baseUrl - The base URL for API requests
   */
  private constructor(baseUrl?: string) {
    const url = baseUrl || `${AxiosClass.baseUrl}/v1`
    this.axiosInstance = axios.create({
      baseURL: url,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
      responseType: 'json',
    })

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // You can add token handling or other request modifications here
        const authToken = TokenManager.getAccessToken()
        if (authToken) {
          config.headers['Authorization'] = `Bearer ${authToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // You can handle global error responses here
        return Promise.reject(error)
      },
    )
  }

  /**
   * Get the singleton instance of AxiosClass
   * @param baseUrl - The base URL for API requests
   * @returns The AxiosInstance for making HTTP requests
   */
  public static getInstance(baseUrl?: string): AxiosInstance {
    if (!AxiosClass.instance) {
      AxiosClass.instance = new AxiosClass(baseUrl)
    }
    return AxiosClass.instance.axiosInstance
  }

  /**
   * Get a public instance of Axios without authentication interceptors
   * @param baseUrl - The base URL for API requests
   * @returns A new AxiosInstance without token interceptors
   */
  public static getPublicInstance(baseUrl?: string): AxiosInstance {
    const url = baseUrl || `${AxiosClass.baseUrl}/api`
    return axios.create({
      baseURL: url,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: false,
      responseType: 'json',
    })
  }

  /**
   * Reset the singleton instance (useful for testing or reconfiguration)
   */
  public static resetInstance(): void {
    AxiosClass.instance = null
  }
}

export default AxiosClass
