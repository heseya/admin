import { Permission, PERMISSIONS_TREE } from '@/consts/permissions'
import { accessor } from '@/store'
import { hasAccess } from '@/utils/hasAccess'
import Vue from 'vue'

export const hasUserAccess = (required: Permission | Permission[]) => {
  const userPermissions = accessor.auth.permissions
  return hasAccess(required)(userPermissions)
}

Vue.directive('can', {
  bind: function (el, binding) {
    if (!hasUserAccess(binding.value)) {
      el.style.display = 'none'
    }
  },
})

Vue.prototype.$p = PERMISSIONS_TREE
Vue.prototype.$can = hasUserAccess
