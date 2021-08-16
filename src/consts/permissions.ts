import {
  Permission,
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
} from '@/interfaces/Permissions'

export const PERMISSIONS_TREE = {
  Admin: AdminPermission,
  Analytics: AnalyticsPermission,
  Apps: AppsPermission,
  Auth: AuthPermission,
  ProductSets: ProductSetsPermission,
  Countries: CountriesPermission,
  ShippingMethods: ShippingMethodsPermission,
  Deposits: DepositsPermission,
  Discounts: DiscountsPermission,
  Items: ItemsPermission,
  Schemas: SchemasPermission,
  Cart: CartPermission,
  Orders: OrdersPermission,
  Packages: PackagesPermission,
  Pages: PagesPermission,
  Payments: PaymentsPermission,
  PaymentMethods: PaymentMethodsPermission,
  Products: ProductsPermission,
  Settings: SettingsPermission,
  Statuses: StatusesPermission,
  Tags: TagsPermission,
  Users: UsersPermission,
  Roles: RolesPermission,
}

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS_TREE)
  .map((o) => Object.values(o))
  .flat()

export type PermissionsTree = typeof PERMISSIONS_TREE
