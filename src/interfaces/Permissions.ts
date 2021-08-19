import { UUID } from './UUID'
import {
  AdminPermission,
  AnalyticsPermission,
  AppsPermission,
  AuthPermission,
  ProductSetsPermission,
  CountriesPermission,
  ShippingMethodsPermission,
  DepositsPermission,
  DiscountsPermission,
  ItemsPermission,
  SchemasPermission,
  CartPermission,
  OrdersPermission,
  PackagesPermission,
  PagesPermission,
  PaymentsPermission,
  PaymentMethodsPermission,
  ProductsPermission,
  SettingsPermission,
  StatusesPermission,
  TagsPermission,
  UsersPermission,
  RolesPermission,
} from '@/enums/permissions'

export type Permission =
  | AdminPermission
  | AnalyticsPermission
  | AppsPermission
  | AuthPermission
  | ProductSetsPermission
  | CountriesPermission
  | ShippingMethodsPermission
  | DepositsPermission
  | DiscountsPermission
  | ItemsPermission
  | SchemasPermission
  | CartPermission
  | OrdersPermission
  | PackagesPermission
  | PagesPermission
  | PaymentsPermission
  | PaymentMethodsPermission
  | ProductsPermission
  | SettingsPermission
  | StatusesPermission
  | TagsPermission
  | UsersPermission
  | RolesPermission

export interface PermissionObject {
  id: UUID
  name: Permission
  description: string
  assignable: boolean
}
