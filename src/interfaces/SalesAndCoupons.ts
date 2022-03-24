/* eslint-disable camelcase */
import { Product } from './Product'
import { ProductSet } from './ProductSet'
import { DiscountConditionGroup, DiscountConditionGroupDto } from './SaleCondition'
import { ShippingMethod } from './ShippingMethod'
import { UUID } from './UUID'

export enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

export enum DiscountTargetType {
  OrderValue = 'order-value',
  Products = 'products', // (Połączone z product-sets)
  ShippingPrice = 'shipping-price',
  CheapestProduct = 'cheapest-product',
}

// ? ---------------------------------------------------------------------------------------------------------------

export interface Sale {
  id: UUID
  name: string
  description: string | null
  value: number
  type: DiscountType
  priority: number
  uses: number
  condition_groups: DiscountConditionGroup[]
  target_type: DiscountTargetType
  target_products: Product[]
  target_sets: ProductSet[]
  target_shipping_methods: ShippingMethod[]
  target_is_allow_list: boolean
}

export interface Coupon extends Sale {
  code: string
}

// ? ---------------------------------------------------------------------------------------------------------------

export interface SaleDto {
  name: string
  description?: string
  value: number
  type: DiscountType
  priority: number
  condition_groups: DiscountConditionGroupDto[]
  target_type: DiscountTargetType
  target_products: UUID[]
  target_sets: UUID[]
  target_is_allow_list: boolean
}

export interface CouponDto extends SaleDto {
  code: string
}
