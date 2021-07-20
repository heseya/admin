/* eslint-disable camelcase */
import { ID } from './ID'

export interface Payment {
  id: ID
  amount: 609
  continue_url: string
  external_id: ID
  method: string
  payed: boolean
  redirect_url: string
}
