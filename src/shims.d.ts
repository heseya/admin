import VueRouter, { Route } from 'vue-router'
import { PermissionsTree } from '@/interfaces/Permissions'

import { hasUserAccess, alertIfNoAccess } from './plugins/permissions'
import { AccessorType } from './store'

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
