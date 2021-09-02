/* eslint-disable camelcase */
import { User } from './User'
import { UUID } from './UUID'

export interface AuditEntry {
  id: UUID
  created_at: string
  old_values: Record<string, any>
  new_values: Record<string, any>
  event: 'updated' | 'created'
  user: User
}
