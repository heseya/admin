import Vue from 'vue'
import Vuesax from 'vuesax'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import 'vuesax/dist/vuesax.css'
import 'boxicons'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.use(Vuesax)
