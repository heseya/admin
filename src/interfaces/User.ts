import { UUID } from './UUID'

export interface User {
  id: UUID
  name: string
  email: string
  avatar: string
}

export interface CreateUserDTO {
  name: string
  email: string
  password: string
}
export interface EditUserDTO {
  id: UUID
  name: string
  email: string
}
