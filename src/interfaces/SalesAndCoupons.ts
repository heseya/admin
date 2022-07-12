/* eslint-disable camelcase */
import {
  DiscountConditionGroup,
  Product,
  ShippingMethod,
  ProductSet,
  SaleUpdateDto,
} from '@heseya/store-core'

// TODO: Change to store-core types when available
export interface SaleFormDto
  extends Omit<
    SaleUpdateDto,
    'target_products' | 'target_sets' | 'target_shipping_methods' | 'condition_groups'
  > {
  condition_groups: DiscountConditionGroup[]
  target_products: Product[]
  target_sets: ProductSet[]
  target_shipping_methods: ShippingMethod[]
}

export interface CouponDto extends SaleUpdateDto {
  code: string
}

export interface CouponFormDto extends SaleFormDto {
  code: string
}
