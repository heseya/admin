import Vue from 'vue'

import { accessor } from '@/store'

import { Permission } from '@/interfaces/Permissions'

import { PERMISSIONS_TREE } from '@/consts/permissions'
import { commentNode } from '@/utils/commentNode'
import { hasAccess } from '@/utils/hasAccess'

export const hasUserAccess = (required: Permission | Permission[]) => {
  const userPermissions = accessor.auth.user?.permissions || []
  return hasAccess(required)(userPermissions)
}

// This directive is used to hide the element if the user doesn't have the permission to it
Vue.directive('can', function (el, binding, vnode) {
  // allowed modifiers: 'hide' | 'disable' | 'remove'
  const behaviour = Object.keys(binding.modifiers)[0] || 'remove'

  if (!hasUserAccess(binding.value)) {
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
