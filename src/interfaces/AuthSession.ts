import { ID } from './ID'

/* eslint-disable camelcase */
export interface AuthSession {
  id: ID
  browser: string
  browser_ver: string
  created_at: string
  device: string
  expires_at: string
  ip: string
  platform: string
  // Is token related to this session revoked
  revoked: boolean
  // Is session the one that user is using currently
  current_session: boolean
}
