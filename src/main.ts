import './plugins/runtimeConfig'

import Vue from 'vue'
import VueMeta from 'vue-meta'
import AntDesign from 'ant-design-vue'
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

import 'ant-design-vue/dist/antd.less'
import 'vue-toast-notification/dist/theme-sugar.css'
import 'boxicons/css/boxicons.min.css'

Vue.config.productionTip = false

Vue.use(VueMeta)
Vue.use(AntDesign)
Vue.use(VueToast)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')

disableScrollOnInput()
