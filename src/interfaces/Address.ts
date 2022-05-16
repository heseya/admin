/* eslint-disable camelcase */
import { UUID } from './UUID'

export interface Address {
  id?: UUID
  address: string
  city: string
  country: string
  country_name: string
  name: string
  phone: string
  vat?: string
  zip: string
}

export interface AddressDto {
  id?: UUID
  name: string
  address: string
  vat?: string
  zip: string
  city: string
  country: string
  phone: string
}
