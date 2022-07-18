import { Permission, PERMISSIONS_TREE as Permissions } from '@heseya/store-core'
import { MediaPermission } from '@/enums/permissions'

export const PERMISSIONS_TREE = {
  ...Permissions,
  Media: MediaPermission, // TODO: remove when merged into develop
}

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS_TREE)
  .map((o) => Object.values(o))
  .flat()

export type PermissionsTree = typeof PERMISSIONS_TREE
