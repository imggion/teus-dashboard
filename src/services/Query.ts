import useAxios from '@/composables/useAxios'
import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query'
import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'
import axios, { AxiosError, AxiosHeaders, type AxiosHeaderValue } from 'axios'
import { TokenManager } from '@/managers/TokenManager'
import AxiosClass from '@/configs/Axios'

export default function tanstackQueryConfig() {
  // Ottieni l'istanza Axios dal singleton
  const api = AxiosClass.getInstance()

  // Funzione di default per le query
  const defaultQueryFn = async ({ queryKey }: { queryKey: any }) => {
    const [url, params] = queryKey

    // Ottieni il token di autenticazione
    const token = TokenManager.getAccessToken()

    // Prepara gli headers con il token
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined

    // Esegui la richiesta con gli headers di autorizzazione
    const { data } = await api.get(url, { params, headers })
    return data
  }

  // Crea il client di query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: defaultQueryFn,
        staleTime: 5000,
      },
      mutations: {
        mutationFn: async (variables: unknown): Promise<unknown> => {
          const { url, method, payload, headers } = variables as {
            url: string
            method: string
            payload?: unknown
            headers?: Record<string, AxiosHeaderValue>
          }

          // Ottieni il token di autenticazione
          const token = TokenManager.getAccessToken()

          // Prepara gli headers con il token
          const authHeaders = token ? { ...headers, Authorization: `Bearer ${token}` } : headers

          // Esegui la richiesta con gli headers aggiornati
          const { data } = await api.request({
            url,
            method,
            data: payload,
            headers: AxiosHeaders.from({ ...api.defaults.headers, ...authHeaders }),
          })
          return data
        },
      },
    },
  })

  // Configurazione del plugin per Vue.js 3
  const vueQueryPluginOptions: VueQueryPluginOptions = {
    queryClient,
  }

  return {
    provide: {
      api,
      queryClient,
    },
    vueQueryPlugin: VueQueryPlugin,
    vueQueryPluginOptions,
  }
}
