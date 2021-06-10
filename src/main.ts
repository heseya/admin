import Vue from 'vue'
// @ts-ignore
import Vuesax from 'vuesax'

import App from './App.vue'
import router from './router'
import store from './store'
import { disableScrollOnInput } from './utils/disableScrollOnInput'

import './utils/rules'
import './utils/slugs'

import './registerServiceWorker'

import 'vuesax/dist/vuesax.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

Vue.use(Vuesax)

disableScrollOnInput()