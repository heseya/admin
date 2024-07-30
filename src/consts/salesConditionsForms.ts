import {
  DiscountConditionType,
  CartLengthDiscountConditionDto,
  DateBetweenDiscountConditionDto,
  MaxUsesDiscountConditionDto,
  MaxUsesPerUserDiscountConditionDto,
  OrderValueDiscountConditionDto,
  ProductInDiscountConditionDto,
  ProductInSetDiscountConditionDto,
  TimeBetweenDiscountConditionDto,
  UserInDiscountConditionDto,
  UserInRoleDiscountConditionDto,
  WeekdayInDiscountConditionDto,
  CouponsCountDiscountConditionDto,
  UserInOrganizationDiscountConditionDto,
} from '@heseya/store-core'

export const EMPTY_ORDER_VALUE_FORM: OrderValueDiscountConditionDto = {
  type: DiscountConditionType.OrderValue,
  min_values: [],
  max_values: [],
  include_taxes: true,
  is_in_range: true,
}

export const EMPTY_USER_IN_ROLE_FORM: UserInRoleDiscountConditionDto = {
  type: DiscountConditionType.UserInRole,
  roles: [],
  is_allow_list: true,
}

export const EMPTY_USER_IN_FORM: UserInDiscountConditionDto = {
  type: DiscountConditionType.UserIn,
  users: [],
  is_allow_list: true,
}

export const EMPTY_USER_IN_ORGANIZATION_FORM: UserInOrganizationDiscountConditionDto = {
  type: DiscountConditionType.UserInOrganization,
  organizations: [],
  is_allow_list: true,
}

export const EMPTY_PRODUCT_IN_SET_FORM: ProductInSetDiscountConditionDto = {
  type: DiscountConditionType.ProductInSet,
  product_sets: [],
  is_allow_list: true,
}

export const EMPTY_PRODUCT_IN_FORM: ProductInDiscountConditionDto = {
  type: DiscountConditionType.ProductIn,
  products: [],
  is_allow_list: true,
}

export const EMPTY_DATE_BETWEEN_FORM: DateBetweenDiscountConditionDto = {
  type: DiscountConditionType.DateBetween,
  start_at: null,
  end_at: null,
  is_in_range: true,
}

export const EMPTY_TIME_BETWEEN_FORM: TimeBetweenDiscountConditionDto = {
  type: DiscountConditionType.TimeBetween,
  start_at: null,
  end_at: null,
  is_in_range: true,
}

export const EMPTY_MAX_USES_FORM: MaxUsesDiscountConditionDto = {
  type: DiscountConditionType.MaxUses,
  max_uses: 0,
}

export const EMPTY_MAX_USES_PER_USER_FORM: MaxUsesPerUserDiscountConditionDto = {
  type: DiscountConditionType.MaxUsesPerUser,
  max_uses: 0,
}

export const EMPTY_WEEKDAY_IN_FORM: WeekdayInDiscountConditionDto = {
  type: DiscountConditionType.WeekdayIn,
  weekday: [false, false, false, false, false, false, false],
}

export const EMPTY_CART_LENGTH_FORM: CartLengthDiscountConditionDto = {
  type: DiscountConditionType.CartLength,
  min_value: 0,
  max_value: 0,
}

export const EMPTY_COUPONS_COUNT_FORM: CouponsCountDiscountConditionDto = {
  type: DiscountConditionType.CouponsCount,
  min_value: 0,
  max_value: 0,
}
