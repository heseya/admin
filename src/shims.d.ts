import VueRouter, { Route } from 'vue-router'

import { PermissionsTree } from '@/consts/permissions'
import { hasUserAccess, alertIfNoAccess } from './plugins/permissions'
import { AccessorType } from './store'

declare global {
  interface Window {
    updateSW: (reloadPage?: boolean) => void

    /**
     * Runtime envs
     */
    runtimeConfig: {
      apiUrl: string
      sentry: {
        url: string
        disabled: string
        enviornment: string
      }
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
    $accessor: AccessorType

    $p: PermissionsTree
    $can: typeof hasUserAccess
    $verboseCan: typeof alertIfNoAccess
  }
}

declare module 'axios' {
  interface AxiosRequestConfig {
    _retried?: boolean
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue-xlsx'
declare module 'vue-json-pretty'
