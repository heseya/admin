import Vue from 'vue'

import { accessor } from '@/store'

import { Permission } from '@/interfaces/Permissions'

import { PERMISSIONS_TREE } from '@/consts/permissions'
import { commentNode } from '@/utils/commentNode'
import { hasAccess } from '@/utils/hasAccess'

export const hasUserAccess = (required: Permission | Permission[], anyOfRequired: boolean) => {
  const userPermissions = accessor.auth.user?.permissions || []
  return hasAccess(required, anyOfRequired)(userPermissions)
}

// This directive is used to hide the element if the user doesn't have the permission to it
Vue.directive('can', function (el, binding, vnode) {
  const behaviour = binding.modifiers.hide
    ? 'hide'
    : binding.modifiers.disable
    ? 'disable'
    : 'remove'

  const anyOfRequired = !!binding.modifiers.any

  if (!hasUserAccess(binding.value, anyOfRequired)) {
    switch (behaviour) {
      case 'disable':
        // @ts-ignore
        el.disabled = true
        break
      case 'hide':
        el.style.display = 'none'
        break
      case 'remove':
      default:
        commentNode(el, vnode)
    }
  }
})

Vue.prototype.$p = PERMISSIONS_TREE
Vue.prototype.$can = hasUserAccess
