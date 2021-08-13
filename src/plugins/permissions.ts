import Vue from 'vue'

import { accessor } from '@/store'

import { Permission } from '@/interfaces/Permissions'

import { PERMISSIONS_TREE } from '@/consts/permissions'
import { commentNode } from '@/utils/commentNode'
import { hasAccess } from '@/utils/hasAccess'

export const hasUserAccess = (required: Permission | Permission[]) => {
  const userPermissions = accessor.auth.permissions
  return hasAccess(required)(userPermissions)
}

Vue.directive('can', function (el, binding, vnode) {
  const behaviour = binding.modifiers.disable ? 'disable' : 'hide'
  const ok = hasUserAccess(binding.value)
  if (!ok) {
    if (behaviour === 'hide') {
      commentNode(el, vnode)
    } else if (behaviour === 'disable') {
      // @ts-ignore
      el.disabled = true
    }
  }
})

Vue.prototype.$p = PERMISSIONS_TREE
Vue.prototype.$can = hasUserAccess
