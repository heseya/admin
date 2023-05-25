/* eslint-disable camelcase */
import {
  DiscountConditionGroup,
  Product,
  ShippingMethod,
  ProductSet,
  SaleUpdateDto,
  DiscountCondition,
} from '@heseya/store-core'

/**
 * Inner interface to update a sale.
 */
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

/**
 * Inner interface to update a coupon.
 */
export interface CouponFormDto extends SaleFormDto {
  code: string
}

/**
 * Inner ConditionGroup interface to update a sale.
 */
export type InnerConditionGroup = Omit<DiscountConditionGroup, 'id' | 'conditions'> & {
  conditions: Array<Omit<DiscountCondition, 'id'> & { forced?: boolean }>
}
