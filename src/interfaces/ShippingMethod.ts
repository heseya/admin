/* eslint-disable camelcase */

import { UUID } from './UUID'
import { PaymentMethod } from './PaymentMethod'
import { AddressDto } from './Address'

export enum ShippingType {
  None = 'none',
  Address = 'address',
  Point = 'point',
  PointExternal = 'point-external',
}
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
  shipping_type: ShippingType
  payment_methods: PaymentMethod[]
  public: boolean
  block_list: boolean
  shipping_time_min: number
  shipping_time_max: number
  countries: ShippingMethodCountry[]
  price_ranges: ShippingMethodPriceRange[]
  integration_key?: string
  app_id?: UUID
  shipping_points?: AddressDto[]
}

export interface ShippingMethodDTO {
  id?: UUID
  name: string
  shipping_type?: ShippingType
  payment_methods: UUID[]
  public: boolean
  block_list: boolean
  shipping_time_min: number
  shipping_time_max: number
  countries: string[]
  price_ranges: ShippingMethodPriceRangeDTO[]
  integration_key?: string
  app_id?: UUID
  shipping_points?: AddressDto[]
}
