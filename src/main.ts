import { createApp } from 'vue'
import VueMeta from 'vue-meta'
import VueToast from 'vue-toast-notification'

import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

import { disableScrollOnInput } from './plugins/disableScrollOnInput'
import './plugins/validation-rules'
import './plugins/slugify'
import './plugins/chart-js'
import './plugins/permissions'
import './plugins/globalComponents'
import './plugins/articleEditor'
import './plugins/sentry'

import './registerServiceWorker'

import 'ant-design-vue/dist/antd.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import 'boxicons/css/boxicons.min.css'

createApp({
  store,
  render: (h: Function) => h(App),
})
  .use(router)
  .use(i18n)
  .use(VueMeta)
  .use(VueToast)
  .mount('#app')

disableScrollOnInput()
