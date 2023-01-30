import { Permission, PERMISSIONS_TREE as Permissions } from '@heseya/store-core'

export const PERMISSIONS_TREE = {
  ...Permissions,
}

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS_TREE)
  .map((o) => Object.values(o))
  .flat()

export type PermissionsTree = typeof PERMISSIONS_TREE
