import { PERMISSIONS_TREE } from './permissions'

export interface MenuItem {
  to: string
  can?: string | string[]
  exact?: boolean
  icon: string
  label: string
}

export const MENU_ITEMS: MenuItem[] = [
  {
    to: '/',
    exact: true,
    icon: 'icons/dashboard-icon.svg',
    label: 'Dashboard',
  },
  {
    can: PERMISSIONS_TREE.Orders.Show,
    to: '/orders',
    icon: 'icons/orders-icon.svg',
    label: 'Zamówienia',
  },
  // {
  //   to: '/analytics',
  //   icon: 'icons/stats-icon.svg',
  //   label: 'Statystyka',
  // },
  {
    can: PERMISSIONS_TREE.Products.Show,
    to: '/products',
    icon: 'icons/products-icon.svg',
    label: 'Produkty',
  },
  {
    can: PERMISSIONS_TREE.ProductSets.Show,
    to: '/collections',
    icon: 'icons/collections-icon.svg',
    label: 'Kolekcje',
  },
  {
    can: PERMISSIONS_TREE.Items.Show,
    to: '/items',
    icon: 'icons/warehouse-icon.svg',
    label: 'Magazyn',
  },
  {
    can: PERMISSIONS_TREE.Discounts.Show,
    to: '/discounts',
    icon: 'icons/discounts-icon.svg',
    label: 'Kody rabatowe',
  },
  {
    to: '/settings',
    icon: 'icons/settings-icon.svg',
    label: 'Ustawienia',
  },
]
