import { Permission as CorePermission, PermissionEntry } from '@heseya/store-core'
import { MediaPermission } from '@/enums/permissions'

export type Permission = CorePermission | MediaPermission

export type PermissionObject = Omit<PermissionEntry, 'name'> & { name: Permission }
