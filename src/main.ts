import Vue from 'vue'
// @ts-ignore
import Vuesax from 'vuesax'
import AntDesign from 'ant-design-vue'
import VueToast from 'vue-toast-notification'

// @ts-ignore
import App from './App.vue'
import router from './router'
import store from './store'

import { disableScrollOnInput } from './plugins/disableScrollOnInput'
import './plugins/quill'
import './plugins/validation-rules'
import './plugins/slugify'
import './plugins/permissions'

import './registerServiceWorker'

import 'vuesax/dist/vuesax.css'
import 'ant-design-vue/dist/antd.less'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.config.productionTip = false

Vue.use(AntDesign)
Vue.use(VueToast)
Vue.use(Vuesax)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

disableScrollOnInput()
