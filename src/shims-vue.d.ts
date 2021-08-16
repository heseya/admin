import VueRouter, { Route } from 'vue-router'

import { hasUserAccess } from './plugins/permissions'
import { PermissionsTree } from './consts/permissions'
import { accessor } from './store'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
    $vs: any
    $accessor: typeof accessor

    $p: PermissionsTree
    $can: typeof hasUserAccess
  }
}
