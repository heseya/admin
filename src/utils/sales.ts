import { cloneDeep } from 'lodash'
import { DiscountConditionGroup, DiscountConditionType } from '@heseya/store-core'
import { CouponCreateDto, SaleCreateDto, DiscountConditionGroupDto } from '@heseya/store-core'
import { CouponFormDto, SaleFormDto } from '@/interfaces/SalesAndCoupons'

export const mapSaleFormToSaleDto = (saleForm: SaleFormDto): SaleCreateDto => {
  return {
    ...cloneDeep(saleForm),
    target_products: saleForm.target_products.map(({ id }) => id),
    target_sets: saleForm.target_sets.map(({ id }) => id),
    target_shipping_methods: saleForm.target_shipping_methods.map(({ id }) => id),
    condition_groups: saleForm.condition_groups.map(mapConditionGroupFormToConditionGroupDto),
  }
}

export const mapCouponFormToCouponDto = (couponForm: CouponFormDto): CouponCreateDto => {
  return mapSaleFormToSaleDto(couponForm) as CouponCreateDto
}

export const mapConditionGroupFormToConditionGroupDto = (
  group: DiscountConditionGroup,
): DiscountConditionGroupDto => {
  return {
    ...cloneDeep(group),
    conditions: group.conditions.map((condition) => {
      switch (condition.type) {
        case DiscountConditionType.ProductIn:
          return { ...condition, products: condition.products.map(({ id }) => id) }
        case DiscountConditionType.UserIn:
          return { ...condition, users: condition.users.map(({ id }) => id) }
        case DiscountConditionType.UserInRole:
          return { ...condition, roles: condition.roles.map(({ id }) => id) }
        case DiscountConditionType.ProductInSet:
          return { ...condition, product_sets: condition.product_sets.map(({ id }) => id) }
        default:
          return condition
      }
    }),
  }
}
