import VueRouter, { Route } from 'vue-router'
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
  }
}
