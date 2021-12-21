/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Address } from './Address'
import { Payment } from './Payment'
import { ShippingMethod } from './ShippingMethod'
import { DiscountCode } from './DiscountCode'
import { CartItem } from './CartItem'

export interface OrderStatus {
  id: UUID
  name: string
  description: string
  color: string
  cancel: boolean
  hidden: boolean
  no_notifications: boolean
}

export interface Order {
  id: UUID
  code: string
  comment?: string
  created_at: string
  currency: string
  delivery_address: Address
  discounts: DiscountCode[]
  email: string
  invoice_address: Address
  payable: boolean
  paid: boolean
  payments: Payment[]
  products: CartItem[]
  shipping_method: ShippingMethod
  shipping_number?: string
  shipping_price: number
  status: OrderStatus
  summary: number
  summary_paid: number
}
