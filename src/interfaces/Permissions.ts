import { Permission as CorePermission, PermissionEntry } from '@heseya/store-core'

export type Permission = CorePermission | 'xd'

export type PermissionObject = Omit<PermissionEntry, 'name'> & { name: Permission }
