import { UUID } from './UUID'
import { Permission } from './Permissions'

export interface Role {
  id: UUID
  name: string
  description: string
  assignable: boolean
  permissions: Permission[]
}

export interface RoleDTO {
  name: string
  description: string
  permissions: Permission[]
}
