/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Permission } from './Permissions'
import { Role } from './Role'
import { Metadata } from './Metadata'
import { Preferences } from './Preferences'
import { UserConsent } from './Consent'

export interface User {
  id: UUID
  name: string
  email: string
  avatar: string
  is_tfa_active: boolean
  roles: Role[]
  permissions: Permission[]
  preferences: Preferences
  metadata: Metadata
  metadata_private?: Metadata
  consents: UserConsent[]
}

export interface CreateUserDTO {
  name: string
  email: string
  password: string
  roles: UUID[]
}
export interface EditUserDTO {
  id: UUID
  name: string
  email: string
  roles: UUID[]
}

export interface UserProfileUpdateDTO {
  name: string
  preferences: Preferences
}
