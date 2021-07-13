/* eslint-disable camelcase */
import { ID } from './ID'

export interface Address {
  id: ID
  address: string
  city: string
  country: string
  country_name: string
  name: string
  phone: string
  vat?: string
  zip: string
}
