import { ID } from './ID'
import { Permission } from './Permissions'
import { Role } from './Role'

export interface User {
  id: ID
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
  id: ID
  name: string
  email: string
  roles: ID[]
}
