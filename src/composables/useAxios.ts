import { getCurrentInstance } from 'vue'
import { type AxiosInstance } from 'axios'

export function useAxios() {
  // This composable return the global axios instance when called
  const appInstance = getCurrentInstance()
  const axios: AxiosInstance = appInstance && appInstance.appContext.config.globalProperties.$axios

  return { axios }
}

export default useAxios
