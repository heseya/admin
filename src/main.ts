import Vue from 'vue'
// @ts-ignore
import Vuesax from 'vuesax'
import Antd from 'ant-design-vue'

// @ts-ignore
import App from './App.vue'
import router from './router'
import store from './store'
import { disableScrollOnInput } from './utils/disableScrollOnInput'

import './utils/rules'
import './utils/slugs'

import './registerServiceWorker'

import 'vuesax/dist/vuesax.css'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

Vue.use(Vuesax)
Vue.use(Antd)

disableScrollOnInput()
