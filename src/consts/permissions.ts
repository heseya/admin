import { Permission, PERMISSIONS_TREE as Permissions } from '@heseya/store-core'
import { LanguagesPermission } from '@/enums/permissions'

export const PERMISSIONS_TREE = {
  ...Permissions,
  Languages: LanguagesPermission,
}

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS_TREE)
  .map((o) => Object.values(o))
  .flat()

export type PermissionsTree = typeof PERMISSIONS_TREE
