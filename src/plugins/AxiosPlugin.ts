import axios from 'axios'
import type { App } from '@vue/runtime-core'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const ENDPOINT_URL = `${BASE_URL}/v1`

const axiosInstance = axios.create({
  baseURL: ENDPOINT_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
  responseType: 'json',
})

// Modify interceptor to use TokenManager
axiosInstance.interceptors.request.use(
  (config) => {
    // const authToken = TokenManager.getAccessToken()
    // if (authToken) {
    //   config.headers.Authorization = `Bearer ${authToken}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// TODO: to implement refresh token logic
// Modify response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as any

//     if (error.response?.status !== 401 || originalRequest._retry) {
//       return Promise.reject(error)
//     }

//     originalRequest._retry = true

//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject })
//       })
//         .then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`
//           return api(originalRequest)
//         })
//         .catch((err) => {
//           return Promise.reject(err)
//         })
//     }

//     isRefreshing = true

//     try {
//       const refreshToken = TokenManager.getRefreshToken()

//       if (!refreshToken) {
//         throw new Error('No refresh token available')
//       }

//       // Refresh token logic
//       const response = await axios.post(`${config.public.apiBase}/auth/refresh`, {
//         refresh_token: refreshToken,
//       })

//       const { access_token, refresh_token } = response.data

//       // Update cookies
//       accessTokenCookie.value = access_token
//       refreshTokenCookie.value = refresh_token

//       // Update TokenManager directly
//       TokenManager.setAccessToken(access_token)
//       TokenManager.setRefreshToken(refresh_token)

//       // Update header
//       originalRequest.headers.Authorization = `Bearer ${access_token}`

//       // Process queue
//       processQueue(null, access_token)

//       return api(originalRequest)
//     } catch (refreshError) {
//       processQueue(refreshError, null)

//       // Clear tokens
//       accessTokenCookie.value = null
//       refreshTokenCookie.value = null
//       TokenManager.clearTokens()

//       // Redirect
//       navigateTo('/accounts/login')

//       return Promise.reject(refreshError)
//     } finally {
//       isRefreshing = false
//     }
//   },
// )

const axiosPlugin = {
  install: (app: App) => {
    app.config.globalProperties.$axios = axiosInstance
  },
}

export default axiosPlugin
