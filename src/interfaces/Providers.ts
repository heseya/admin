/* eslint-disable camelcase */
import { UUID } from './UUID'

export enum AuthProviderKey {
  Google = 'google',
  Apple = 'apple',
  Facebook = 'facebook',
  GitHub = 'github',
  GitLab = 'gitlab',
  Bitbucket = 'bitbucket',
  LinkedIn = 'linkedin',
}

export interface AuthProvider {
  key: AuthProviderKey
  active: boolean
  client_id: string | null
  client_secret: string | null
}

export interface UserProvider {
  provider: AuthProviderKey
  provider_user_id: string
  user_id: UUID
}

export interface AuthProviderListResource {
  key: AuthProviderKey
  active: boolean
}

export interface AuthProviderDto {
  client_id: string
  client_secret: string
  active: boolean
}
