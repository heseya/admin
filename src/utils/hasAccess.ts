import { hasAccess as sdkHasAccess, Permission as HeseyaPermission } from '@heseya/store-core'

import { Permission } from '@/interfaces/Permissions'

/**
 * Checks if the user has the permission to perform the action
 * ? It is wrapper for @heseya/store-core hasAccess, because locally we use Permission type which is wider than @heseya/store-core one
 * @param anyOfRequired - if true, the user must have only one of the required permissions to have access, else it needs all of them
 */
export const hasAccess =
  (required: Permission | Permission[], anyOfRequired = false) =>
  (userPermissions: Permission[]): boolean => {
    return sdkHasAccess(
      required as HeseyaPermission | HeseyaPermission[],
      anyOfRequired,
    )(userPermissions as HeseyaPermission[])
  }
