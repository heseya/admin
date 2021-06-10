/* eslint-disable camelcase */

import { PaymentMethod } from './PaymentMethod'

export interface ShippingMethodCountry {
  code: string
  name: string
}

export interface ShippingMethodPriceRange {
  id: string
  start: number
  prices: {
    id: string
    value: number
    model_id: string
  }[]
}

export interface ShippingMethodPriceRangeDTO {
  start: number
  value: number
}
export interface ShippingMethod {
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
