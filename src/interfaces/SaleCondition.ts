import { UUID } from './UUID'

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

export interface DiscountConditionGroup {
  id: UUID
  type: DiscountConditionType
}

export interface DiscountConditionGroupDto {
  type: DiscountConditionType
}
