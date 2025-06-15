import { type App } from 'vue'
import tanstackQueryConfig from '@/services/Query'

export default {
  install: (app: App) => {
    const { provide, vueQueryPlugin, vueQueryPluginOptions } = tanstackQueryConfig()

    app.use(vueQueryPlugin, vueQueryPluginOptions)

    if (provide) {
      Object.entries(provide).forEach(([key, value]) => {
        app.provide(key, value)
      })
    }
  },
}
