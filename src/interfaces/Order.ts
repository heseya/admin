/* eslint-disable camelcase */
import { UUID } from './UUID'
import { AddressDto } from './Address'
import { Payment } from './Payment'
import { ShippingMethod, ShippingType } from './ShippingMethod'
import { OrderProduct } from './OrderProduct'
import { OrderDiscount } from './SalesAndCoupons'
import { Metadata } from './Metadata'
import { OrderDocument } from './OrderDocuments'

export interface OrderStatus {
  id: UUID
  name: string
  description: string
  color: string
  cancel: boolean
  hidden: boolean
  no_notifications: boolean
  metadata: Metadata
  metadata_private?: Metadata
}

export type OrderStatusDto = Omit<OrderStatus, 'id' | 'metadata' | 'metadata_private'>

export interface Order {
  id: UUID
  code: string
  comment?: string
  created_at: string
  currency: string
  shipping_place: AddressDto | string
  discounts: OrderDiscount[]
  email: string
  billing_address: AddressDto | null
  payable: boolean
  paid: boolean
  payments: Payment[]
  products: OrderProduct[]
  shipping_method: ShippingMethod
  shipping_method_id: UUID
  shipping_number?: string
  shipping_type: ShippingType
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
  metadata: Metadata
  metadata_private?: Metadata
  documents: OrderDocument[]
}
