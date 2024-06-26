import { Permission } from '@/interfaces/Permissions'
import { accessor } from '@/store'
import { FEATURE_FLAGS } from './featureFlags'
import { PERMISSIONS_TREE } from './permissions'

let id = 0
const nextId = () => (++id).toString()

export enum MenuItemType {
  Link = 'link',
  Spacer = 'spacer',
}

export enum SettingsSection {
  Shop = 'shop',
  Products = 'products',
  Orders = 'orders',
  Shipping = 'shipping',
  Users = 'users',
  Other = 'other',
}

export interface MenuLink {
  type: MenuItemType.Link
  id: string
  default?: boolean
  to: string
  can?: Permission | Permission[]
  exact?: boolean
  iconClass?: string
  svgIconPath?: string
  iconPath?: string
  label: string
  disabled?: true
  hidden?: boolean | (() => boolean)
  isMicrofrontend?: true
  section?: SettingsSection
}
export interface MenuSpacer {
  id: string
  type: MenuItemType.Spacer
  disabled: true
}
export type MenuItem = MenuLink | MenuSpacer

export const MENU_ITEMS: MenuItem[] = [
  {
    id: nextId(),
    type: MenuItemType.Link,
    exact: true,
    default: true,
    to: '/',
    svgIconPath: 'icons/dashboard-icon.svg',
    label: 'nav.dashboard',
    disabled: true,
  },
  { id: nextId(), type: MenuItemType.Spacer, disabled: true },
  {
    id: nextId(),
    type: MenuItemType.Link,
    default: true,
    to: '/orders',
    svgIconPath: 'icons/orders-icon.svg',
    label: 'models.orders',
    disabled: true,
    can: PERMISSIONS_TREE.Orders.Show,
  },
  { id: nextId(), type: MenuItemType.Spacer, disabled: true },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/pages',
    iconClass: 'bx bxs-copy-alt',
    label: 'models.pages',
    can: PERMISSIONS_TREE.Pages.Show,
    section: SettingsSection.Shop,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/languages',
    iconClass: 'bx bx-text',
    label: 'models.languages',
    section: SettingsSection.Shop,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/currencies',
    iconClass: 'bx bxs-dollar-circle',
    label: 'models.currencies',
    section: SettingsSection.Shop,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/sales-channels',
    iconClass: 'bx bxs-bank',
    label: 'models.salesChannels',
    section: SettingsSection.Shop,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/banners',
    iconClass: 'bx bxs-image',
    label: 'models.banners',
    can: PERMISSIONS_TREE.Banners.Show,
    section: SettingsSection.Shop,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    default: true,
    to: '/products',
    svgIconPath: 'icons/products-icon.svg',
    label: 'models.products',
    can: PERMISSIONS_TREE.Products.Show,
    section: SettingsSection.Products,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    default: true,
    to: '/collections',
    svgIconPath: 'icons/collections-icon.svg',
    label: 'models.sets',
    can: PERMISSIONS_TREE.ProductSets.Show,
    section: SettingsSection.Products,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    default: true,
    to: '/items',
    svgIconPath: 'icons/warehouse-icon.svg',
    label: 'nav.warehouse',
    can: PERMISSIONS_TREE.Items.Show,
    section: SettingsSection.Orders,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    default: true,
    to: '/coupons',
    iconClass: 'bx bxs-coupon',
    label: 'models.coupons',
    can: PERMISSIONS_TREE.Coupons.Show,
    section: SettingsSection.Products,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    default: true,
    to: '/sales',
    svgIconPath: 'icons/sales-icon.svg',
    label: 'models.sales',
    can: PERMISSIONS_TREE.Sales.Show,
    section: SettingsSection.Products,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    default: true,
    exact: true,
    to: '/settings',
    svgIconPath: 'icons/settings-icon.svg',
    label: 'nav.settings',
    disabled: true,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/attributes',
    iconClass: 'bx bx-spreadsheet',
    label: 'models.attributes',
    can: PERMISSIONS_TREE.Attributes.Show,
    section: SettingsSection.Products,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/tags',
    iconClass: 'bx bxs-purchase-tag',
    label: 'models.tags',
    can: PERMISSIONS_TREE.Tags.Show,
    section: SettingsSection.Products,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/schemas',
    iconClass: 'bx bxs-customize',
    label: 'models.schemas',
    can: PERMISSIONS_TREE.Products.Show,
    section: SettingsSection.Products,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/statuses',
    iconClass: 'bx bxs-check-circle',
    label: 'models.statuses',
    can: PERMISSIONS_TREE.Statuses.Show,
    section: SettingsSection.Orders,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/payment-methods',
    iconClass: 'bx bxs-credit-card',
    label: 'models.payment_methods',
    can: PERMISSIONS_TREE.PaymentMethods.Show,
    section: SettingsSection.Orders,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/shipping-methods',
    iconClass: 'bx bxs-truck',
    label: 'models.shipping_methods',
    can: PERMISSIONS_TREE.ShippingMethods.Show,
    section: SettingsSection.Shipping,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/users',
    iconClass: 'bx bxs-group',
    label: 'nav.users',
    can: PERMISSIONS_TREE.Users.Show,
    section: SettingsSection.Users,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/roles',
    iconClass: 'bx bx-task',
    label: 'nav.roles',
    can: PERMISSIONS_TREE.Roles.Show,
    section: SettingsSection.Users,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/b2b/companies',
    iconClass: 'bx bx-buildings',
    label: 'nav.b2b',
    can: PERMISSIONS_TREE.Roles.Show,
    hidden: () => accessor.config.env[FEATURE_FLAGS.B2B] !== '1',
    section: SettingsSection.Users,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/consents',
    iconClass: 'bx bx-paragraph',
    label: 'nav.consents',
    can: PERMISSIONS_TREE.Consents.Show,
    section: SettingsSection.Users,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/apps',
    iconClass: 'bx bxs-store-alt',
    label: 'nav.apps',
    can: PERMISSIONS_TREE.Apps.Show,
    section: SettingsSection.Other,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/webhooks',
    iconClass: 'bx bxs-bot',
    label: 'nav.webhooks',
    can: PERMISSIONS_TREE.Webhooks.Show,
    section: SettingsSection.Other,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/seo',
    iconClass: 'bx bxl-google',
    label: 'nav.seo',
    section: SettingsSection.Other,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/redirects',
    iconClass: 'bx bx-link-external',
    label: 'nav.redirects',
    section: SettingsSection.Other,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/providers',
    iconClass: 'bx bxs-log-in',
    label: 'nav.providers',
    can: PERMISSIONS_TREE.Settings.Show,
    section: SettingsSection.Other,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/advanced',
    iconClass: 'bx bxs-cog',
    label: 'nav.advanced',
    can: PERMISSIONS_TREE.Settings.Show,
    section: SettingsSection.Other,
  },
  {
    id: nextId(),
    type: MenuItemType.Link,
    to: '/settings/media',
    iconClass: 'bx bxs-image',
    label: 'models.media',
    can: PERMISSIONS_TREE.Media.Show,
    section: SettingsSection.Shop,
  },
]

export const MENU_LINKS = MENU_ITEMS.filter((item) => item.type === MenuItemType.Link) as MenuLink[]
export const DEFAULT_MENU_ITEMS = MENU_ITEMS.filter(
  (item) => item.type === MenuItemType.Spacer || item.default,
)

export const SETTINGS_LINKS = MENU_LINKS.filter((item) => item.section) as MenuLink[]
