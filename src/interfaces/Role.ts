import { UUID } from './UUID'
import { Permission } from './Permissions'

export interface Role {
  id: UUID
  name: string
  description: string
  assignable: boolean
  permissions: Permission[]
}
