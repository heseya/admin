/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Permission } from './Permissions'
import { Metadata } from './Metadata'

export interface Role {
  id: UUID
  name: string
  description: string
  assignable: boolean
  permissions: Permission[]
  metadata: Metadata
  metadata_private?: Metadata
}

export interface RoleDTO {
  name: string
  description: string
  permissions: Permission[]
}
