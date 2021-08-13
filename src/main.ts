import Vue from 'vue'
// @ts-ignore
import Vuesax from 'vuesax'

// @ts-ignore
import App from './App.vue'
import router from './router'
import store from './store'

import { disableScrollOnInput } from './plugins/disableScrollOnInput'
import './plugins/quill'
import './plugins/validation-rules'
import './plugins/slugify'

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
