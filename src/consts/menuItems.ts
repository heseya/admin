import { Permission } from '@/interfaces/Permissions'
import { PERMISSIONS_TREE } from './permissions'

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
    id: '1',
    type: MenuItemType.Link,
    exact: true,
    default: true,
    to: '/',
    svgIconPath: 'icons/dashboard-icon.svg',
    label: 'nav.dashboard',
    disabled: true,
  },
  { id: '2', type: MenuItemType.Spacer, disabled: true },
  {
    id: '3',
    type: MenuItemType.Link,
    default: true,
    to: '/orders',
    svgIconPath: 'icons/orders-icon.svg',
    label: 'models.orders',
    disabled: true,
    can: PERMISSIONS_TREE.Orders.ShowSummary,
  },
  { id: '4', type: MenuItemType.Spacer, disabled: true },
  {
    id: '5',
    type: MenuItemType.Link,
    to: '/pages',
    iconClass: 'bx bxs-copy-alt',
    label: 'models.pages',
    can: PERMISSIONS_TREE.Pages.Show,
    section: SettingsSection.Shop,
  },
  {
    id: '6',
    type: MenuItemType.Link,
    to: '/settings/banners',
    iconClass: 'bx bxs-image',
    label: 'models.banners',
    can: PERMISSIONS_TREE.Banners.Show,
    section: SettingsSection.Shop,
  },
  {
    id: '7',
    type: MenuItemType.Link,
    default: true,
    to: '/products',
    svgIconPath: 'icons/products-icon.svg',
    label: 'models.products',
    can: PERMISSIONS_TREE.Products.Show,
    section: SettingsSection.Products,
  },
  {
    id: '8',
    type: MenuItemType.Link,
    default: true,
    to: '/collections',
    svgIconPath: 'icons/collections-icon.svg',
    label: 'models.sets',
    can: PERMISSIONS_TREE.ProductSets.Show,
    section: SettingsSection.Products,
  },
  {
    id: '9',
    type: MenuItemType.Link,
    default: true,
    to: '/items',
    svgIconPath: 'icons/warehouse-icon.svg',
    label: 'nav.warehouse',
    can: PERMISSIONS_TREE.Items.Show,
    section: SettingsSection.Orders,
  },
  {
    id: '10',
    type: MenuItemType.Link,
    default: true,
    to: '/coupons',
    svgIconPath: 'icons/coupons-icon.svg',
    label: 'models.coupons',
    can: PERMISSIONS_TREE.Coupons.Show,
    section: SettingsSection.Products,
  },
  {
    id: '11',
    type: MenuItemType.Link,
    default: true,
    to: '/sales',
    svgIconPath: 'icons/sales-icon.svg',
    label: 'models.sales',
    can: PERMISSIONS_TREE.Sales.Show,
    section: SettingsSection.Products,
  },
  { id: '12', type: MenuItemType.Spacer, disabled: true },
  {
    id: '13',
    type: MenuItemType.Link,
    default: true,
    exact: true,
    to: '/settings',
    svgIconPath: 'icons/settings-icon.svg',
    label: 'nav.settings',
    disabled: true,
  },
  {
    id: '14',
    type: MenuItemType.Link,
    to: '/settings/attributes',
    iconClass: 'bx bx-spreadsheet',
    label: 'models.attributes',
    can: PERMISSIONS_TREE.Attributes.Show,
    section: SettingsSection.Products,
  },
  {
    id: '15',
    type: MenuItemType.Link,
    to: '/settings/tags',
    iconClass: 'bx bxs-purchase-tag',
    label: 'models.tags',
    can: PERMISSIONS_TREE.Tags.Show,
    section: SettingsSection.Products,
  },
  {
    id: '16',
    type: MenuItemType.Link,
    to: '/schemas',
    iconClass: 'bx bxs-customize',
    label: 'models.schemas',
    can: PERMISSIONS_TREE.Products.Show,
    section: SettingsSection.Products,
  },
  {
    id: '17',
    type: MenuItemType.Link,
    to: '/settings/statuses',
    iconClass: 'bx bxs-check-circle',
    label: 'models.statuses',
    can: PERMISSIONS_TREE.Statuses.Show,
    section: SettingsSection.Orders,
  },
  {
    id: '18',
    type: MenuItemType.Link,
    to: '/settings/shipping-methods',
    iconClass: 'bx bxs-truck',
    label: 'models.shipping_methods',
    can: PERMISSIONS_TREE.ShippingMethods.Show,
    section: SettingsSection.Shipping,
  },
  {
    id: '19',
    type: MenuItemType.Link,
    to: '/settings/package-templates',
    iconClass: 'bx bxs-box',
    label: 'models.package_templates',
    can: PERMISSIONS_TREE.Packages.Show,
    section: SettingsSection.Shipping,
  },
  {
    id: '20',
    type: MenuItemType.Link,
    to: '/settings/users',
    iconClass: 'bx bxs-group',
    label: 'nav.users',
    can: PERMISSIONS_TREE.Users.Show,
    section: SettingsSection.Users,
  },
  {
    id: '21',
    type: MenuItemType.Link,
    to: '/settings/roles',
    iconClass: 'bx bx-task',
    label: 'nav.roles',
    can: PERMISSIONS_TREE.Roles.Show,
    section: SettingsSection.Users,
  },
  {
    id: '22',
    type: MenuItemType.Link,
    to: '/settings/consents',
    iconClass: 'bx bx-paragraph',
    label: 'nav.consents',
    can: PERMISSIONS_TREE.Consents.Show,
    section: SettingsSection.Users,
  },
  {
    id: '23',
    type: MenuItemType.Link,
    to: '/apps',
    iconClass: 'bx bxs-store-alt',
    label: 'nav.apps',
    can: PERMISSIONS_TREE.Apps.Show,
    section: SettingsSection.Other,
  },
  {
    id: '24',
    type: MenuItemType.Link,
    to: '/webhooks',
    iconClass: 'bx bxs-bot',
    label: 'nav.webhooks',
    can: PERMISSIONS_TREE.Webhooks.Show,
    section: SettingsSection.Other,
  },
  {
    id: '25',
    type: MenuItemType.Link,
    to: '/settings/seo',
    iconClass: 'bx bxl-google',
    label: 'nav.seo',
    section: SettingsSection.Other,
  },
  {
    id: '26',
    type: MenuItemType.Link,
    to: '/settings/providers',
    iconClass: 'bx bxs-log-in',
    label: 'nav.providers',
    can: PERMISSIONS_TREE.Settings.Show,
    section: SettingsSection.Other,
  },
  {
    id: '27',
    type: MenuItemType.Link,
    to: '/settings/advanced',
    iconClass: 'bx bxs-cog',
    label: 'nav.advanced',
    can: PERMISSIONS_TREE.Settings.Show,
    section: SettingsSection.Other,
  },
]

export const MENU_LINKS = MENU_ITEMS.filter((item) => item.type === MenuItemType.Link) as MenuLink[]
export const DEFAULT_MENU_ITEMS = MENU_ITEMS.filter(
  (item) => item.type === MenuItemType.Spacer || item.default,
)
export const MENU_AVAILABLE_ITEMS = MENU_LINKS.filter((item) => !item.default)
export const SETTINGS_LINKS = MENU_LINKS.filter((item) => item.section) as MenuLink[]
