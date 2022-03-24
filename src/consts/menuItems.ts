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
  { type: MenuItemType.Spacer },
  {
    type: MenuItemType.Link,
    to: '/settings',
    icon: 'icons/settings-icon.svg',
    label: 'nav.settings',
  },
]

export const MENU_LINKS = MENU_ITEMS.filter((item) => item.type === MenuItemType.Link) as MenuLink[]
