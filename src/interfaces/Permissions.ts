import { Permission as CorePermission } from '@heseya/store-core'
import { UUID } from './UUID'

export type Permission = CorePermission
export interface PermissionObject {
  id: UUID
  name: Permission
  // eslint-disable-next-line camelcase
  display_name: string
  description: string
  assignable: boolean
}
