import { cloneDeep, isArray, isNil } from 'lodash'
import {
  CouponCreateDto,
  DiscountConditionGroupDto,
  DiscountConditionType,
  DiscountValueDto,
  PriceDto,
  SaleCreateDto,
  CartLengthDiscountConditionDto,
  CouponsCountDiscountConditionDto,
  DateBetweenDiscountConditionDto,
  DiscountConditionDto,
  MaxUsesDiscountConditionDto,
  MaxUsesPerUserDiscountConditionDto,
  OrderValueDiscountConditionDto,
  ProductInDiscountConditionDto,
  ProductInSetDiscountConditionDto,
  TimeBetweenDiscountConditionDto,
  UserInDiscountConditionDto,
  UserInOrganizationDiscountConditionDto,
  UserInRoleDiscountConditionDto,
  WeekdayInDiscountConditionDto,
} from '@heseya/store-core'
import { CouponFormDto, SaleFormDto } from '@/interfaces/SalesAndCoupons'

const getDiscountValueDto = <
  T extends {
    percentage?: string | number | null | undefined
    amounts?: PriceDto[] | null | undefined
  },
>(
  valueLike: T,
): DiscountValueDto => {
  if (!isNil(valueLike.percentage)) {
    return {
      percentage: valueLike.percentage.toString(),
      amounts: undefined,
    }
  }
  if (!isArray(valueLike.amounts)) {
    throw new Error(
      `[getDiscountValueDto] amounts must be array! but is: ${typeof valueLike.amounts}`,
    )
  }

  if (!valueLike.amounts.length) {
    throw new Error(`[getDiscountValueDto] amounts is empty!`)
  }

  return {
    percentage: undefined,
    amounts: valueLike.amounts,
  }
}

export const mapSaleFormToSaleDto = (saleForm: SaleFormDto): SaleCreateDto => {
  return {
    ...getDiscountValueDto(saleForm),
    published: saleForm.published ? [...saleForm.published] : [],
    translations: saleForm.translations ? cloneDeep(saleForm.translations) : {},
    slug: saleForm.slug,
    active: saleForm.active,
    priority: saleForm.priority,
    condition_groups: saleForm.condition_groups.map(mapConditionGroupFormToConditionGroupDto),
    target_type: saleForm.target_type,
    target_products: saleForm.target_products.map(({ id }) => id),
    target_sets: saleForm.target_sets.map(({ id }) => id),
    target_shipping_methods: saleForm.target_shipping_methods.map(({ id }) => id),
    target_is_allow_list: saleForm.target_is_allow_list,
    seo: cloneDeep(saleForm.seo),
  }
}

export const mapCouponFormToCouponDto = (couponForm: CouponFormDto): CouponCreateDto => {
  return {
    ...mapSaleFormToSaleDto(couponForm),
    code: couponForm.code,
  }
}

export const mapConditionGroupFormToConditionGroupDto = (
  group: SaleFormDto['condition_groups'][number],
): DiscountConditionGroupDto => {
  return {
    conditions: group.conditions.map(mapSaleFormConditionGroupToDiscountConditionGroupDto),
  } as DiscountConditionGroupDto
}

const mapSaleFormConditionGroupToDiscountConditionGroupDto = (
  condition: SaleFormDto['condition_groups'][number]['conditions'][number],
): DiscountConditionDto => {
  switch (condition.type) {
    case DiscountConditionType.ProductIn:
      return {
        type: condition.type,
        products: condition.products.map(({ id }) => id),
        is_allow_list: condition.is_allow_list,
      } as ProductInDiscountConditionDto
    case DiscountConditionType.UserIn:
      return {
        type: condition.type,
        users: condition.users.map(({ id }) => id),
        is_allow_list: condition.is_allow_list,
      } as UserInDiscountConditionDto
    case DiscountConditionType.UserInRole:
      return {
        type: condition.type,
        roles: condition.roles.map(({ id }) => id),
        is_allow_list: condition.is_allow_list,
      } as UserInRoleDiscountConditionDto
    case DiscountConditionType.UserInOrganization:
      return {
        type: condition.type,
        organizations: condition.organizations.map(({ id }) => id),
        is_allow_list: condition.is_allow_list,
      } as UserInOrganizationDiscountConditionDto
    case DiscountConditionType.ProductInSet:
      return {
        type: condition.type,
        product_sets: condition.product_sets.map(({ id }) => id),
        is_allow_list: condition.is_allow_list,
      } as ProductInSetDiscountConditionDto
    case DiscountConditionType.OrderValue:
      return {
        type: condition.type,
        min_values: condition.min_values,
        max_values: condition.max_values,
        include_taxes: condition.include_taxes, // TODO: backend required this flag but they don't know if it works
        is_in_range: condition.is_in_range,
      } as OrderValueDiscountConditionDto
    case DiscountConditionType.DateBetween:
    case DiscountConditionType.TimeBetween:
      return {
        type: condition.type,
        start_at: condition.start_at,
        end_at: condition.end_at,
        is_in_range: condition.is_in_range,
      } as DateBetweenDiscountConditionDto | TimeBetweenDiscountConditionDto
    case DiscountConditionType.MaxUses:
      return {
        type: condition.type,
        max_uses: condition.max_uses,
      } as MaxUsesDiscountConditionDto | MaxUsesPerUserDiscountConditionDto
    case DiscountConditionType.WeekdayIn:
      return {
        type: condition.type,
        weekday: condition.weekday,
      } as WeekdayInDiscountConditionDto
    case DiscountConditionType.CartLength:
    case DiscountConditionType.CouponsCount:
      return {
        type: condition.type,
        min_value: condition.min_value,
        max_value: condition.max_value,
      } as CartLengthDiscountConditionDto | CouponsCountDiscountConditionDto
    default:
      return condition as never
  }
}
