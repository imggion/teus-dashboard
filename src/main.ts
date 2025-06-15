import './assets/main.css'
import RippleDirective from './directives/ripple'
import axiosPlugin from './plugins/AxiosPlugin'
import queryPlugin from './plugins/query'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(axiosPlugin)
app.use(queryPlugin)
app.directive('ripple', RippleDirective)

app.mount('#app')
