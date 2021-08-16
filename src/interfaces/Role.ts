import { ID } from './ID'
import { Permission } from './Permissions'

export interface Role {
  id: ID
  name: string
  description: string
  assignable: boolean
  permissions: Permission[]
}
