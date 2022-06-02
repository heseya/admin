import { PERMISSIONS_TREE } from './permissions'
export interface MenuLink {
  to: string
  can?: string | string[]
  exact?: boolean
  icon?: string
  predefinedIcon?: string
  label: string
  disabled?: boolean
}

export const DEFAULT_MENU_ITEMS: MenuLink[] = [
  {
    exact: true,
    to: '/',
    predefinedIcon: 'icons/dashboard-icon.svg',
    label: 'nav.dashboard',
    disabled: true,
  },
  {
    to: '/orders',
    predefinedIcon: 'icons/orders-icon.svg',
    label: 'models.orders',
    disabled: true,
    can: PERMISSIONS_TREE.Orders.Show,
  },
  {
    to: '/products',
    predefinedIcon: 'icons/products-icon.svg',
    label: 'models.products',
    can: PERMISSIONS_TREE.Products.Show,
  },
  {
    to: '/collections',
    predefinedIcon: 'icons/collections-icon.svg',
    label: 'models.sets',
    can: PERMISSIONS_TREE.ProductSets.Show,
  },
  {
    to: '/items',
    predefinedIcon: 'icons/warehouse-icon.svg',
    label: 'nav.warehouse',
    can: PERMISSIONS_TREE.Items.Show,
  },
  {
    to: '/coupons',
    predefinedIcon: 'icons/coupons-icon.svg',
    label: 'models.coupons',
    can: PERMISSIONS_TREE.Coupons.Show,
  },
  {
    to: '/sales',
    predefinedIcon: 'icons/sales-icon.svg',
    label: 'models.sales',
    can: PERMISSIONS_TREE.Sales.Show,
  },
  {
    exact: true,
    to: '/settings',
    predefinedIcon: 'icons/settings-icon.svg',
    label: 'nav.settings',
    disabled: true,
  },
]

export const AVAILABLE_MENU_ITEMS: MenuLink[] = [
  {
    to: '/pages',
    icon: 'bx bxs-copy-alt',
    label: 'models.pages',
  },
  {
    to: '/settings/banners',
    icon: 'bx bxs-image',
    label: 'models.banners',
  },
  {
    to: '/settings/attributes',
    icon: 'bx bx-spreadsheet',
    label: 'models.attributes',
  },
  {
    to: '/settings/tags',
    icon: 'bx bxs-purchase-tag',
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
    to: '/settings/consents',
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
