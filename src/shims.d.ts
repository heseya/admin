import { PermissionsTree } from '@/consts/permissions'
import { hasUserAccess, alertIfNoAccess } from './plugins/permissions'
import { AccessorType } from './store'

declare global {
  interface Window {
    updateSW: (reloadPage?: boolean) => void
    apiUrl?: string
  }
}

declare module 'vue' {
  import { CompatVue } from '@vue/runtime-dom'
  const Vue: CompatVue
  export default Vue
  export * from '@vue/runtime-dom'
  const { configureCompat } = Vue
  export { configureCompat }

  interface ComponentCustomProperties {
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
