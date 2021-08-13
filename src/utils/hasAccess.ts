import { Permission } from '@/consts/permissions'
import { isArray } from 'lodash'

export const hasAccess =
  (required: Permission | Permission[]) =>
  (userPermissions: Permission[]): boolean => {
    const requiredArray = isArray(required) ? required : [required]
    return requiredArray.some((requiredPermission: Permission) =>
      userPermissions.includes(requiredPermission),
    )
  }
