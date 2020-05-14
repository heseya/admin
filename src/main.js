import Vue from 'vue'
import Vuesax from 'vuesax'

import App from './App.vue'
import router from './router'
import store from './store'

import './utils/rules'

import './registerServiceWorker'

import 'vuesax/dist/vuesax.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

Vue.use(Vuesax)
