import { ID } from './ID'

export enum AdminPermission {
  Login = 'admin.login',
}

export enum AnalyticsPermission {
  Payments = 'analytics.payments',
}

export enum AppsPermission {
  Show = 'apps.show',
  Install = 'apps.install',
  Remove = 'apps.remove',
}

export enum AuthPermission {
  Login = 'auth.login',
  Register = 'auth.register',
  PasswordReset = 'auth.password_reset',
  PasswordChange = 'auth.password_change',
  SessionsShow = 'auth.sessions.show',
  SessionsRevoke = 'auth.sessions.revoke',
}

export enum ProductSetsPermission {
  Show = 'product_sets.show',
  ShowDetails = 'product_sets.show_details',
  ShowHidden = 'product_sets.show_hidden',
  Add = 'product_sets.add',
  Edit = 'product_sets.edit',
  Remove = 'product_sets.remove',
}

export enum CountriesPermission {
  Show = 'countries.show',
}

export enum ShippingMethodsPermission {
  Show = 'shipping_methods.show',
  Add = 'shipping_methods.add',
  Edit = 'shipping_methods.edit',
  Remove = 'shipping_methods.remove',
}

export enum DepositsPermission {
  Show = 'deposits.show',
  Add = 'deposits.add',
}

export enum DiscountsPermission {
  Show = 'discounts.show',
  ShowDetails = 'discounts.show_details',
  Add = 'discounts.add',
  Edit = 'discounts.edit',
  Remove = 'discounts.remove',
}

export enum ItemsPermission {
  Show = 'items.show',
  ShowDetails = 'items.show_details',
  Add = 'items.add',
  Edit = 'items.edit',
  Remove = 'items.remove',
}

export enum SchemasPermission {
  Remove = 'schemas.remove',
}

export enum CartPermission {
  Verify = 'cart.verify',
}

export enum OrdersPermission {
  Show = 'orders.show',
  Add = 'orders.add',
  ShowDetails = 'orders.show_details',
  ShowHidden = 'orders.show_summary',
  Edit = 'orders.edit',
  EditStatus = 'orders.edit.status',
}

export enum PackagesPermission {
  Show = 'packages.show',
  Add = 'packages.add',
  Edit = 'packages.edit',
  Remove = 'packages.remove',
}

export enum PagesPermission {
  Show = 'pages.show',
  ShowDetails = 'pages.show_details',
  ShowHidden = 'pages.show_hidden',
  Add = 'pages.add',
  Edit = 'pages.edit',
  Remove = 'pages.remove',
}

export enum PaymentsPermission {
  Add = 'payments.add',
  Edit = 'payments.edit',
}

export enum PaymentMethodsPermission {
  Show = 'payment_methods.show',
  ShowHidden = 'payment_methods.show_hidden',
  Add = 'payment_methods.add',
  Edit = 'payment_methods.edit',
  Remove = 'payment_methods.remove',
}

export enum ProductsPermission {
  Show = 'products.show',
  ShowDetails = 'products.show_details',
  ShowHidden = 'products.show_hidden',
  Add = 'products.add',
  Edit = 'products.edit',
  Remove = 'products.remove',
}

export enum SettingsPermission {
  Show = 'settings.show',
  ShowHidden = 'settings.show_hidden',
  ShowDetails = 'settings.show_details',
  Add = 'settings.add',
  Edit = 'settings.edit',
  Remove = 'settings.remove',
}

export enum StatusesPermission {
  Show = 'statuses.show',
  Add = 'statuses.add',
  Edit = 'statuses.edit',
  Remove = 'statuses.remove',
}

export enum TagsPermission {
  Show = 'tags.show',
  Add = 'tags.add',
  Edit = 'tags.edit',
  Remove = 'tags.remove',
}

export enum UsersPermission {
  Show = 'users.show',
  ShowDetails = 'users.show_details',
  Add = 'users.add',
  Edit = 'users.edit',
  Remove = 'users.remove',
}

export enum RolesPermission {
  Show = 'roles.show',
  ShowDetails = 'roles.show_details',
  Add = 'roles.add',
  Edit = 'roles.edit',
  Remove = 'roles.remove',
}

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
  id: ID
  name: Permission
  description: string
  assignable: boolean
}
