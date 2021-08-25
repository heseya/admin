import Vue from 'vue'

import { accessor } from '@/store'

import { Permission } from '@/interfaces/Permissions'

import { PERMISSIONS_TREE } from '@/consts/permissions'
import { commentNode } from '@/utils/commentNode'
import { hasAccess } from '@/utils/hasAccess'

export const hasUserAccess = (required: Permission | Permission[], anyOfRequired = false) => {
  const userPermissions = accessor.auth.user?.permissions || []
  return hasAccess(required, anyOfRequired)(userPermissions)
}

export const alertIfNoAccess = (required: Permission | Permission[], anyOfRequired = false) => {
  if (!hasUserAccess(required, anyOfRequired)) {
    accessor.auth.setPermissionsError(new Error(`Access denied`))
    return false
  }
  return true
}

const map = new Map<any, [Node, Node]>()

// This directive is used to hide the element if the user doesn't have the permission to it
Vue.directive('can', function (el, binding, vnode) {
  const anyOfRequired = !!binding.modifiers.any
  const behaviour = binding.modifiers.hide
    ? 'hide'
    : binding.modifiers.disable
    ? 'disable'
    : 'remove'

  if (!hasUserAccess(binding.value, anyOfRequired)) {
    switch (behaviour) {
      case 'disable':
        // @ts-ignore
        el.disabled = true
        break
      case 'remove':
        if (el.parentNode) {
          const comment = document.createComment(' xd ')
          map.set(el, [el.parentNode, comment])
          el.parentNode.replaceChild(comment, el)
        }
        break
      case 'hide':
        el.style.display = 'none'
    }
  } else {
    switch (behaviour) {
      case 'disable':
        // @ts-ignore
        el.disabled = false
        break
      case 'remove':
        const [parentNode, comment] = map.get(el) || []
        if (parentNode && comment) {
          map.delete(el)
          parentNode.replaceChild(el, comment)
        }
        break
      case 'hide':
        el.style.display = ''
    }
  }
})

Vue.prototype.$p = PERMISSIONS_TREE
Vue.prototype.$can = hasUserAccess
Vue.prototype.$verboseCan = alertIfNoAccess
