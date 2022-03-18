/* eslint-disable camelcase */
import { UUID } from './UUID'

export interface Payment {
  id: UUID
  amount: number
  continue_url: string
  external_id: UUID
  method: string
  paid: boolean
  redirect_url: string
  date: string
}
