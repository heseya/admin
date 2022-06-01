import { PERMISSIONS_TREE } from './permissions'

enum MenuItemType {
  Link = 'link',
  Spacer = 'spacer',
}

export interface MenuLink {
  type: MenuItemType.Link
  to: string
  can?: string | string[]
  exact?: boolean
  icon: string
  label: string
}

export interface MenuSpacer {
  type: MenuItemType.Spacer
}

export type MenuItem = MenuLink | MenuSpacer

export const MENU_ITEMS: MenuItem[] = [
  {
    type: MenuItemType.Link,
    to: '/',
    exact: true,
    icon: 'icons/dashboard-icon.svg',
    label: 'nav.dashboard',
  },
  { type: MenuItemType.Spacer },
  {
    type: MenuItemType.Link,
    can: PERMISSIONS_TREE.Orders.Show,
    to: '/orders',
    icon: 'icons/orders-icon.svg',
    label: 'models.orders',
  },
  { type: MenuItemType.Spacer },
  // {
  //   type: MenuItemType.Link,
  //   to: '/analytics',
  //   icon: 'icons/stats-icon.svg',
  //   label: 'nav.analytics',
  // },
  {
    type: MenuItemType.Link,
    can: PERMISSIONS_TREE.Products.Show,
    to: '/products',
    icon: 'icons/products-icon.svg',
    label: 'models.products',
  },
  {
    type: MenuItemType.Link,
    can: PERMISSIONS_TREE.ProductSets.Show,
    to: '/collections',
    icon: 'icons/collections-icon.svg',
    label: 'models.sets',
  },
  {
    type: MenuItemType.Link,
    can: PERMISSIONS_TREE.Items.Show,
    to: '/items',
    icon: 'icons/warehouse-icon.svg',
    label: 'nav.warehouse',
  },
  {
    type: MenuItemType.Link,
    can: PERMISSIONS_TREE.Coupons.Show,
    to: '/coupons',
    icon: 'icons/coupons-icon.svg',
    label: 'models.coupons',
  },
  {
    type: MenuItemType.Link,
    can: PERMISSIONS_TREE.Sales.Show,
    to: '/sales',
    icon: 'icons/sales-icon.svg',
    label: 'models.sales',
  },
  { type: MenuItemType.Spacer },
  {
    type: MenuItemType.Link,
    to: '/settings',
    icon: 'icons/settings-icon.svg',
    label: 'nav.settings',
  },
]

export const MENU_LINKS = MENU_ITEMS.filter((item) => item.type === MenuItemType.Link) as MenuLink[]

export const DEFAULT_MENU_ITEMS = [
  {
    exact: true,
    permanent: true,
    image: 'icons/dashboard-icon.svg',
    label: 'nav.dashboard',
    to: '/',
  },
  {
    permanent: true,
    to: '/orders',
    image: 'icons/orders-icon.svg',
    label: 'models.orders',
  },
  {
    to: '/products',
    image: 'icons/products-icon.svg',
    label: 'models.products',
  },
  {
    to: '/collections',
    image: 'icons/collections-icon.svg',
    label: 'models.sets',
  },
  {
    to: '/items',
    image: 'icons/warehouse-icon.svg',
    label: 'nav.warehouse',
  },
  {
    to: '/coupons',
    image: 'icons/coupons-icon.svg',
    label: 'models.coupons',
  },
  {
    to: '/sales',
    image: 'icons/sales-icon.svg',
    label: 'models.sales',
  },
  {
    permanent: true,
    to: '/settings',
    image: 'icons/settings-icon.svg',
    label: 'nav.settings',
  },
]

export const AVAILABLE_MENU_ITEMS = [
  {
    exact: true,
    icon: 'bx bxs-copy-alt',
    label: 'models.pages',
    to: '/pages',
  },
  {
    to: '/settings/banners',
    icon: 'bx bxs-image',
    label: 'models.banners',
  },
  {
    to: '/settings/tags',
    exact: true,
    icon: 'bx bx-spreadsheet',
    label: 'models.attributes',
  },
  {
    to: '/settings/attributes',
    exact: true,
    icon: 'bxs-purchase-tag',
    label: 'models.tags',
  },
  {
    to: '/schemas',
    icon: 'bx bxs-customize',
    label: 'models.schemas',
  },
  {
    to: '/settings/statuses',
    icon: 'bx bxs-check-circle',
    label: 'models.statuses',
  },
  {
    to: '/settings/shipping-methods',
    icon: 'bx bxs-truck',
    label: 'models.shipping_methods',
  },
  {
    to: '/settings/package-templates',
    icon: 'bx bxs-box',
    label: 'models.package_templates',
  },
  {
    to: '/settings/users',
    icon: 'bx bxs-group',
    label: 'nav.users',
  },
  {
    to: '/settings/roles',
    icon: 'bx bx-task',
    label: 'nav.roles',
  },
  {
    to: '/apps',
    icon: 'bx bxs-store-alt',
    label: 'nav.apps',
  },
  {
    to: 'settings/consents',
    icon: 'bx bx-file-blank',
    label: 'nav.consents',
  },
  {
    to: '/webhooks',
    icon: 'bx bxs-bot',
    label: 'nav.webhooks',
  },
  {
    to: '/settings/seo',
    icon: 'bx bxl-google',
    label: 'nav.seo',
  },

  {
    to: '/settings/advanced',
    icon: 'bx bxs-cog',
    label: 'nav.advanced',
  },
]
