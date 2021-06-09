import { NuxtCookies } from 'cookie-universal-nuxt'
import { ToastApi } from 'vue-toast-notification'

import { App } from 'adamed-algorithms-configs'
import { ApiService } from './services/api'

import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $vs: any
  }
}
