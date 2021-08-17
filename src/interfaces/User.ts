import { UUID } from './UUID'
import { Permission } from './Permissions'
import { Role } from './Role'

export interface User {
  id: UUID
  name: string
  email: string
  avatar: string
  roles: Role[]
  permissions: Permission[]
}

export interface CreateUserDTO {
  name: string
  email: string
  password: string
  roles: ID[]
}
export interface EditUserDTO {
  id: UUID
  name: string
  email: string
  roles: ID[]
}
