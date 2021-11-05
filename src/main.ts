import Vue from 'vue'
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
import './plugins/globalComponents'
import './plugins/articleEditor'

import './registerServiceWorker'

import 'ant-design-vue/dist/antd.less'
import 'vue-toast-notification/dist/theme-sugar.css'
import 'boxicons/css/boxicons.min.css'

Vue.config.productionTip = false

Vue.use(AntDesign)
Vue.use(VueToast)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

disableScrollOnInput()
