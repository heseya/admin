/* eslint-disable camelcase */

import { UUID } from './UUID'

export interface App {
  id: UUID
  name: string
  url: string
  created_at: string
  updated_at: string
}
