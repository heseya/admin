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
  SeoPermission,
  WebhooksPermission,
  AttributesPermission,
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
  | WebhooksPermission
  | SeoPermission
  | AttributesPermission

export interface PermissionObject {
  id: UUID
  name: Permission
  // eslint-disable-next-line camelcase
  display_name: string
  description: string
  assignable: boolean
}
