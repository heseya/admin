/* eslint-disable camelcase */

import { UUID } from './UUID'
import { PaymentMethod } from './PaymentMethod'

export interface ShippingMethodCountry {
  code: string
  name: string
}

export interface ShippingMethodPriceRange {
  id: UUID
  start: number
  prices: {
    id: UUID
    value: number
    model_id: UUID
  }[]
}

export interface ShippingMethodPriceRangeDTO {
  start: number
  value: number
}
export interface ShippingMethod {
  id: UUID
  name: string
  payment_methods: PaymentMethod[]
  public: boolean
  black_list: boolean
  countries: ShippingMethodCountry[]
  price_ranges: ShippingMethodPriceRange[]
}

export interface ShippingMethodDTO {
  id?: UUID
  name: string
  payment_methods: string[]
  public: boolean
  black_list: boolean
  countries: string[]
  price_ranges: ShippingMethodPriceRangeDTO[]
}
