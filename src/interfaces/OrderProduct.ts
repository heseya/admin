/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Product } from './Product'
import { SchemaValue } from './Schema'
import { OrderDiscount } from './SalesAndCoupons'

export interface OrderProduct {
  id: UUID
  quantity: number
  price: number
  price_initial: number
  discounts: OrderDiscount[]
  product: Product
  schemas: SchemaValue[]
  deposits: unknown[] // TODO: type
}
