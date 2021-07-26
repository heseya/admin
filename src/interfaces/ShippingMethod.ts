/* eslint-disable camelcase */

import { ID } from './ID'
import { PaymentMethod } from './PaymentMethod'

export interface ShippingMethodCountry {
  code: string
  name: string
}

export interface ShippingMethodPriceRange {
  id: ID
  start: number
  prices: {
    id: ID
    value: number
    model_id: ID
  }[]
}

export interface ShippingMethodPriceRangeDTO {
  start: number
  value: number
}
export interface ShippingMethod {
  id: ID
  name: string
  payment_methods: PaymentMethod[]
  public: boolean
  black_list: boolean
  countries: ShippingMethodCountry[]
  price_ranges: ShippingMethodPriceRange[]
}

export interface ShippingMethodDTO {
  name: string
  payment_methods: string[]
  public: boolean
  black_list: boolean
  countries: string[]
  price_ranges: ShippingMethodPriceRangeDTO[]
}
