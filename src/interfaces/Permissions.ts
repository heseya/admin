import { LanguagesPermission } from '@/enums/permissions'
import { Permission as CorePermission, PermissionEntry } from '@heseya/store-core'

export type Permission = CorePermission | LanguagesPermission

export type PermissionObject = Omit<PermissionEntry, 'name'> & { name: Permission }
