import { Permission, PERMISSIONS_TREE as Permissions } from '@heseya/store-core'
import { ConsentsPermission } from '@/enums/permissions'

// TODO: Remove ConsentsPermission when it's available in store-core permission tree
export const PERMISSIONS_TREE = { ...Permissions, Consents: ConsentsPermission }

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS_TREE)
  .map((o) => Object.values(o))
  .flat()

export type PermissionsTree = typeof PERMISSIONS_TREE
