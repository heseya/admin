import Vue from 'vue'

import { accessor } from '@/store'

import { Permission } from '@/interfaces/Permissions'

import { PERMISSIONS_TREE } from '@/consts/permissions'
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

const elementsMap = new Map<HTMLElement, [Node, Comment]>()

// This directive is used to hide the element if the user doesn't have the permission to it
Vue.directive('can', function (el, binding) {
  const anyOfRequired = !!binding.modifiers.any
  const behaviour = binding.modifiers.hide
    ? 'hide'
    : binding.modifiers.disable
    ? 'disable'
    : 'remove'

  const isElementVisible = hasUserAccess(binding.value, anyOfRequired)

  switch (behaviour) {
    case 'disable':
      // @ts-ignore
      el.disabled = !isElementVisible
      break
    case 'remove':
      if (isElementVisible) {
        const [parentNode, comment] = elementsMap.get(el) || []
        if (parentNode && comment) {
          // Comment node is replaced back with original node
          elementsMap.delete(el)
          parentNode.replaceChild(el, comment)
        }
      } else {
        if (el.parentNode) {
          // Element node is replaced by a comment node
          const comment = document.createComment(' xd ')
          elementsMap.set(el, [el.parentNode, comment])
          el.parentNode.replaceChild(comment, el)
        }
      }
      break
    case 'hide':
      el.style.display = isElementVisible ? '' : 'none'
  }
})

Vue.prototype.$p = PERMISSIONS_TREE
Vue.prototype.$can = hasUserAccess
Vue.prototype.$verboseCan = alertIfNoAccess
