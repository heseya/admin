/* eslint-disable camelcase */
import { Product } from './Product'
import { ProductSet } from './ProductSet'
import { Role } from './Role'
import { User } from './User'
import { UUID } from './UUID'

export interface DiscountConditionGroup {
  id: UUID
  conditions: DiscountCondition[]
}

export interface DiscountConditionGroupDto {
  conditions: DiscountConditionDto[]
}

// ? ------------------------------------------------------------------------------------

export enum DiscountConditionType {
  OrderValue = 'order-value',
  UserInRole = 'user-in-role',
  UserIn = 'user-in',
  ProductInSet = 'product-in-set',
  ProductIn = 'product-in',
  DateBetween = 'date-between',
  TimeBetween = 'time-between',
  MaxUses = 'max-uses',
  MaxUsesPerUser = 'max-uses-per-user',
  WeekdayIn = 'weekday-in',
  CartLength = 'cart-length',
}

// ? ------------------------------------------------------------------------------------

export interface OrderValueDiscountCondition {
  type: DiscountConditionType.OrderValue
  min_value: number | null
  max_value: number | null
  include_taxes: boolean
  is_in_range: boolean
}

export interface UserInRoleDiscountCondition {
  type: DiscountConditionType.UserInRole
  roles: Role[]
  is_allow_list: boolean
}

export interface UserInDiscountCondition {
  type: DiscountConditionType.UserIn
  users: User[]
  is_allow_list: boolean
}

export interface ProductInSetDiscountCondition {
  type: DiscountConditionType.ProductInSet
  product_sets: ProductSet[]
  is_allow_list: boolean
}

export interface ProductInDiscountCondition {
  type: DiscountConditionType.ProductIn
  products: Product[]
  is_allow_list: boolean
}

export interface DateBetweenDiscountCondition {
  type: DiscountConditionType.DateBetween
  start_at: string | null // Date
  end_at: string | null // Date
  is_in_range: boolean
}

export interface TimeBetweenDiscountCondition {
  type: DiscountConditionType.TimeBetween
  start_at: string | null // H:i:s
  end_at: string | null // H:i:s
  is_in_range: boolean
}

export interface MaxUsesDiscountCondition {
  type: DiscountConditionType.MaxUses
  max_uses: number
}

export interface MaxUsesPerUserDiscountCondition {
  type: DiscountConditionType.MaxUsesPerUser
  max_uses: number
}

export interface WeekDayInDiscountCondition {
  type: DiscountConditionType.WeekdayIn
  /**
   * [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
   */
  weekday: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
}

export interface CartLengthDiscountCondition {
  type: DiscountConditionType.CartLength
  min_value: number | null
  max_value: number | null
}

// ? ------------------------------------------------------------------------------------

export type DiscountConditionDto =
  | OrderValueDiscountCondition
  | UserInRoleDiscountCondition
  | UserInDiscountCondition
  | ProductInSetDiscountCondition
  | ProductInDiscountCondition
  | DateBetweenDiscountCondition
  | TimeBetweenDiscountCondition
  | MaxUsesDiscountCondition
  | MaxUsesPerUserDiscountCondition
  | WeekDayInDiscountCondition
  | CartLengthDiscountCondition

export type DiscountCondition = DiscountConditionDto & { id: UUID }
