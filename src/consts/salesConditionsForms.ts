import {
  CartLengthDiscountCondition,
  DateBetweenDiscountCondition,
  DiscountConditionType,
  MaxUsesDiscountCondition,
  MaxUsesPerUserDiscountCondition,
  OrderValueDiscountCondition,
  ProductInDiscountCondition,
  ProductInSetDiscountCondition,
  TimeBetweenDiscountCondition,
  UserInDiscountCondition,
  UserInRoleDiscountCondition,
  WeekDayInDiscountCondition,
} from '@/interfaces/SaleCondition'

export const EMPTY_ORDER_VALUE_FORM: OrderValueDiscountCondition = {
  type: DiscountConditionType.OrderValue,
  min_value: 0,
  max_value: 0,
  include_taxes: true,
  is_in_range: true,
}

export const EMPTY_USER_IN_ROLE_FORM: UserInRoleDiscountCondition = {
  type: DiscountConditionType.UserInRole,
  roles: [],
  is_allow_list: true,
}

export const EMPTY_USER_IN_FORM: UserInDiscountCondition = {
  type: DiscountConditionType.UserIn,
  users: [],
  is_allow_list: true,
}

export const EMPTY_PRODUCT_IN_SET_FORM: ProductInSetDiscountCondition = {
  type: DiscountConditionType.ProductInSet,
  product_sets: [],
  is_allow_list: true,
}

export const EMPTY_PRODUCT_IN_FORM: ProductInDiscountCondition = {
  type: DiscountConditionType.ProductIn,
  products: [],
  is_allow_list: true,
}

export const EMPTY_DATE_BETWEEN_FORM: DateBetweenDiscountCondition = {
  type: DiscountConditionType.DateBetween,
  start_at: null,
  end_at: null,
  is_in_range: true,
}

export const EMPTY_TIME_BETWEEN_FORM: TimeBetweenDiscountCondition = {
  type: DiscountConditionType.TimeBetween,
  start_at: null,
  end_at: null,
  is_in_range: true,
}

export const EMPTY_MAX_USES_FORM: MaxUsesDiscountCondition = {
  type: DiscountConditionType.MaxUses,
  max_uses: 0,
}

export const EMPTY_MAX_USES_PER_USER_FORM: MaxUsesPerUserDiscountCondition = {
  type: DiscountConditionType.MaxUsesPerUser,
  max_uses: 0,
}

export const EMPTY_WEEKDAY_IN_FORM: WeekDayInDiscountCondition = {
  type: DiscountConditionType.WeekdayIn,
  weekday: [false, false, false, false, false, false, false],
}

export const EMPTY_CART_LENGTH_FORM: CartLengthDiscountCondition = {
  type: DiscountConditionType.CartLength,
  min_value: 0,
  max_value: 0,
}
