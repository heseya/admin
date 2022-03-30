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
  CouponsPermission,
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
  SeoPermission,
  WebhooksPermission,
  SalesPermission,
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
  | CouponsPermission
  | SalesPermission
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
  | WebhooksPermission
  | SeoPermission

export interface PermissionObject {
  id: UUID
  name: Permission
  // eslint-disable-next-line camelcase
  display_name: string
  description: string
  assignable: boolean
}
