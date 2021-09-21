/* eslint-disable camelcase */

import { Permission } from './Permissions'
import { UUID } from './UUID'

export interface App {
  id: UUID
  name: string
  url: string
  microfrontend_url?: string
  slug: string
  version: string
  description?: string
  icon?: string
  author?: string
  permissions: string[]
}

export interface CreateAppDto {
  url: string
  name?: string // [TODO]
  licence_key: string
  allowed_permissions: string[]
}

export interface IntegrationInfo {
  name: string
  author: string
  version: string
  microfrontend_url?: string
  api_version: string // '^1.2.0' [TODO]
  description: string
  icon: string
  required_permissions: string[]
  internal_permissions: Permission[]
}

//  CONFIG

interface AppConfigBase {
  key: string
  label: string
  placeholder: string
  type: string
  // eslint-disable-next-line camelcase
  default_value: any
  required: boolean
  value?: any
}
interface AppConfigInput extends AppConfigBase {
  type: 'text' | 'number' | 'color' | 'date' | 'datetime-local'
}

interface AppConfigSelect extends AppConfigBase {
  type: 'select'
  options: { value: string; label: string }[]
}

export type AppConfigField = AppConfigSelect | AppConfigInput
