import { ID } from './ID'

export interface User {
  id: ID
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
  id: ID
  name: string
  email: string
}
