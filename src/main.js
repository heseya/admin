import Vue from 'vue'
import Vuesax from 'vuesax'
import wysiwyg from 'vue-wysiwyg'

import App from './App.vue'
import router from './router'
import store from './store'

import './registerServiceWorker'

import 'vuesax/dist/vuesax.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

Vue.use(Vuesax)
Vue.use(wysiwyg)
