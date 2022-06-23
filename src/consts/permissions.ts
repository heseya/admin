import { Permission } from '@/interfaces/Permissions'
import {
  AdminPermission,
  AnalyticsPermission,
  AppsPermission,
  AuthPermission,
  AuditsPermission,
  ProductSetsPermission,
  ConsentsPermission,
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
  LanguagesPermission,
  SalesPermission,
  AttributesPermission,
  BannersPermission,
} from '@/enums/permissions'

export const PERMISSIONS_TREE = {
  Admin: AdminPermission,
  Analytics: AnalyticsPermission,
  Apps: AppsPermission,
  Auth: AuthPermission,
  Audits: AuditsPermission,
  Banners: BannersPermission,
  Consents: ConsentsPermission,
  ProductSets: ProductSetsPermission,
  Countries: CountriesPermission,
  ShippingMethods: ShippingMethodsPermission,
  Deposits: DepositsPermission,
  Coupons: CouponsPermission,
  Sales: SalesPermission,
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
  Seo: SeoPermission,
  Webhooks: WebhooksPermission,
  Languages: LanguagesPermission,
  Attributes: AttributesPermission,
}

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS_TREE)
  .map((o) => Object.values(o))
  .flat()

export type PermissionsTree = typeof PERMISSIONS_TREE
