import { Permission as CorePermission, PermissionEntry } from '@heseya/store-core'

export type Permission = CorePermission

export type PermissionObject = Omit<PermissionEntry, 'name'> & { name: Permission }
