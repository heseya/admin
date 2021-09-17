/* eslint-disable camelcase */

import { Permission } from './Permissions'
import { UUID } from './UUID'

export interface App {
  id: UUID
  url: string
  name: string
  slug: string
  version: string
  description?: string
  icon?: string
  author?: string
  permissions: string[]
}

export interface CreateAppDto {
  app_url: string
  app_name?: string // [TODO]
  licence_key: string
  allowed_permissions: string[]
}

export interface IntegrationInfo {
  name: string
  author: string
  version: string
  api_version: string // '^1.2.0' [TODO]
  description: string
  icon: string
  required_permissions: string[]
  internal_permissions: Permission[]
}
