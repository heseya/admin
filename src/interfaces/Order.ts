/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Address } from './Address'
import { Payment } from './Payment'
import { ShippingMethod } from './ShippingMethod'
import { OrderProduct } from './OrderProduct'
import { OrderDiscount } from './SalesAndCoupons'

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
  discounts: OrderDiscount[]
  email: string
  invoice_address: Address
  payable: boolean
  paid: boolean
  payments: Payment[]
  products: OrderProduct[]
  shipping_method: ShippingMethod
  shipping_number?: string
  status: OrderStatus

  /**
   * basket value without discounts
   */
  cart_total_initial: number
  /**
   * basket value after discounts
   */
  cart_total: number

  /**
   * shipping price without discounts
   */
  shipping_price_initial: number
  /**
   * shipping price after discounts
   */
  shipping_price: number

  /**
   * total order value after discounts
   */
  summary: number
  /**
   * amount already paid by client
   */
  summary_paid: number
}
