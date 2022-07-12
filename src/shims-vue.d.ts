import VueRouter, { Route } from 'vue-router'

import { hasUserAccess, alertIfNoAccess } from './plugins/permissions'
import { PermissionsTree } from './consts/permissions'
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
