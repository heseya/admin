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
  MaxUsesPerUser = 'max-user-per-user',
  WeekdayIn = 'weekday-in',
  CartLength = 'cart-length',
}

export interface DiscountCondition {
  id: UUID
  type: DiscountConditionType
}

export type DiscountConditionDto = Omit<DiscountCondition, 'id'>
