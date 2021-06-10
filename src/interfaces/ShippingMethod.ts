/* eslint-disable camelcase */

import { PaymentMethod } from './PaymentMethod'

export interface ShippingMethod {
  name: string
  price: number
  payment_methods: PaymentMethod[]
  public: boolean
  black_list: boolean
  countries: string[]
}
