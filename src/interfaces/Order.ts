/* eslint-disable camelcase */
import { ID } from './ID'
import { Address } from './Address'
import { Payment } from './Payment'
import { Product } from './Product'
import { ShippingMethod } from './ShippingMethod'
import { DiscountCode } from './DiscountCode'

export interface OrderStatus {
  id: ID
  name: string
  description: string
  color: string
  cancel: boolean
}

export interface Order {
  id: ID
  code: string
  comment?: string
  created_at: string
  currency: string
  delivery_address: Address
  discounts: DiscountCode[]
  email: string
  invoice_address: Address
  payable: boolean
  payed: boolean
  payments: Payment[]
  products: Product[]
  shipping_method: ShippingMethod
  shipping_number?: string
  shipping_price: number
  status: OrderStatus
  summary: number
  summary_payed: null // TODO
}
