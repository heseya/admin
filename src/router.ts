import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import { Permission } from '@/interfaces/Permissions'
import { PERMISSIONS_TREE as Permissions } from '@/consts/permissions'
import { accessor } from './store'
import { hasAccess } from './utils/hasAccess'
import { FEATURE_FLAGS } from './consts/featureFlags'

Vue.use(VueRouter)
Vue.use(VueMeta)

const router = new VueRouter({
  mode: 'history',
  base: window.runtimeConfig.baseUrl,
  routes: [
    {
      path: '/login',
      name: 'Login',
      props: true,
      component: () => import('./views/auth/Login.vue'),
      meta: {
        hiddenNav: true,
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/oauth-login-return',
      name: 'OAuthLoginReturn',
      component: () => import('./views/auth/OAuthLoginReturn.vue'),
      meta: {
        hiddenNav: true,
      },
    },
    {
      path: '/merge-accounts',
      name: 'MergeAccounts',
      component: () => import('./views/auth/MergeAccounts.vue'),
      meta: {
        hiddenNav: true,
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      props: true,
      component: () => import('./views/auth/ResetPassword.vue'),
      meta: {
        hiddenNav: true,
        redirectIfLoggedIn: true,
      },
    },
    {
      path: '/new-password',
      name: 'NewPassword',
      props: true,
      component: () => import('./views/auth/NewPassword.vue'),
      meta: {
        hiddenNav: true,
      },
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: () => import('./views/Analytics.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/items',
      name: 'Items',
      component: () => import('./views/items/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Items.Show],
      },
    },
    {
      path: '/items/:id/deposits',
      name: 'ItemDepositsList',
      component: () => import('./views/items/deposits.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Deposits.Show],
        returnUrl: '/items',
      },
    },
    {
      path: '/schemas',
      name: 'Schemas',
      component: () => import('./views/schemas/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Products.Show],
      },
    },
    {
      path: '/schemas/:id',
      name: 'SchemaCiew',
      component: () => import('./views/schemas/view.vue'),
      meta: {
        returnUrl: '/schemas',
        requiresAuth: true,
        permissions: [Permissions.Products.ShowDetails],
      },
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('./views/products/Index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Products.Show],
      },
    },
    {
      path: '/products/:id',
      name: 'ProductsView',
      component: () => import('./views/products/View.vue'),
      meta: {
        returnUrl: '/products',
        requiresAuth: true,
        permissions: [Permissions.Products.ShowDetails],
      },
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('./views/orders/Index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Orders.Show],
      },
    },
    {
      path: '/orders/:id',
      name: 'OrdersView',
      component: () => import('./views/orders/view.vue'),
      meta: {
        returnUrl: '/orders',
        requiresAuth: true,
        permissions: [Permissions.Orders.ShowDetails],
      },
    },
    {
      path: '/coupons',
      name: 'Coupons',
      component: () => import('./views/coupons/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Coupons.Show],
      },
    },
    {
      path: '/coupons/:id',
      name: 'CouponsView',
      component: () => import('./views/coupons/view.vue'),
      meta: {
        returnUrl: '/coupons',
        requiresAuth: true,
        permissions: [Permissions.Coupons.ShowDetails],
      },
    },
    {
      path: '/sales',
      name: 'Sales',
      component: () => import('./views/sales/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Sales.Show],
      },
    },
    {
      path: '/sales/:id',
      name: 'SalesView',
      component: () => import('./views/sales/view.vue'),
      meta: {
        returnUrl: '/sales',
        requiresAuth: true,
        permissions: [Permissions.Sales.Show],
      },
    },
    {
      path: '/pages',
      name: 'Pages',
      component: () => import('./views/pages/Index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Pages.Show],
      },
    },
    {
      path: '/pages/:id',
      name: 'PagesView',
      component: () => import('./views/pages/View.vue'),
      meta: {
        returnUrl: '/pages',
        requiresAuth: true,
        permissions: [Permissions.Pages.ShowDetails],
      },
    },
    {
      path: '/settings/banners',
      name: 'Banners',
      component: () => import('./views/banners/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Banners.Show],
      },
    },
    {
      path: '/settings/currencies',
      name: 'Currencies',
      component: () => import('./views/settings/Currencies.vue'),
      meta: {
        requiresAuth: true,
        permissions: [],
      },
    },
    {
      path: '/settings/banners/:id',
      name: 'BannersView',
      component: () => import('./views/banners/view.vue'),
      meta: {
        returnUrl: '/settings/banners',
        requiresAuth: true,
        permissions: [Permissions.Banners.Show],
      },
    },
    {
      path: '/settings/media',
      name: 'Media',
      component: () => import('./views/settings/Media.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Media.Show],
      },
    },
    {
      path: '/apps',
      name: 'Apps',
      component: () => import('./views/apps/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Apps.Show],
      },
    },
    {
      path: '/apps/debug',
      name: 'AppsDebug',
      component: () => import('./views/apps/Debug.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/apps/:id',
      name: 'AppsView',
      component: () => import('./views/apps/View.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('./views/settings/Index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/two-factor-authentication',
      name: 'TwoFactorAuthentication',
      component: () => import('./views/settings/TwoFactorAuth.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/collections',
      name: 'ProductSets',
      component: () => import('./views/productSets/Index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.ProductSets.Show],
      },
    },
    {
      path: '/collections/:id',
      name: 'ProductSets View',
      component: () => import('./views/productSets/View.vue'),
      meta: {
        returnUrl: '/collections',
        requiresAuth: true,
        permissions: [Permissions.ProductSets.ShowDetails],
      },
    },
    {
      path: '/collections/:id/products',
      name: 'ProductSets Products View',
      component: () => import('./views/productSets/Products.vue'),
      meta: {
        returnUrl: '/collections',
        requiresAuth: true,
        permissions: [Permissions.ProductSets.ShowDetails],
      },
    },

    {
      path: '/settings/attributes',
      name: 'Attributes',
      component: () => import('./views/attributes/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Attributes.Show],
      },
    },
    {
      path: '/settings/attributes/:id',
      name: 'AttributesView',
      component: () => import('./views/attributes/view.vue'),
      meta: {
        returnUrl: '/settings/attributes',
        requiresAuth: true,
        permissions: [Permissions.Attributes.Show],
      },
    },
    {
      path: '/settings/shipping-methods',
      name: 'ShippingMethods',
      component: () => import('./views/settings/ShippingMethods.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.ShippingMethods.Show],
      },
    },
    {
      path: '/settings/statuses',
      name: 'Statuses',
      component: () => import('./views/settings/Statuses.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Statuses.Show],
      },
    },
    {
      path: '/settings/payment-methods',
      name: 'Payment methods',
      component: () => import('./views/settings/PaymentMethods.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.PaymentMethods.Show],
      },
    },
    {
      path: '/settings/tags',
      name: 'Tags',
      component: () => import('./views/settings/Tags.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Tags.Show],
      },
    },
    {
      path: '/settings/providers',
      name: 'Providers',
      component: () => import('./views/settings/Providers.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Auth.ProvidersManage],
      },
    },
    {
      path: '/settings/advanced',
      name: 'PageSettings',
      component: () => import('./views/settings/Settings.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Settings.Show],
      },
    },
    {
      path: '/settings/users',
      name: 'UsersList',
      component: () => import('./views/users/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Users.Show],
      },
    },
    {
      path: '/settings/users/:id',
      name: 'UserDetails',
      component: () => import('./views/users/view.vue'),
      meta: {
        returnUrl: '/settings/users',
        requiresAuth: true,
        permissions: [Permissions.Users.ShowDetails],
      },
    },
    {
      path: '/settings/redirects',
      name: 'RedirectsList',
      component: () => import('./views/redirects/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Redirects.Show],
      },
    },
    {
      path: '/settings/redirects/:id',
      name: 'RedirectsView',
      component: () => import('./views/redirects/view.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Redirects.Show],
      },
    },
    {
      path: '/settings/seo',
      name: 'Seo',
      component: () => import('./views/seo/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/languages',
      name: 'Languages',
      component: () => import('./views/languages/index.vue'),
      meta: {
        requiresAuth: true,
        // all authenticated users can show languages
        // permissions: [Permissions.Languages.Show],
      },
    },
    {
      path: '/settings/roles',
      name: 'Roles',
      component: () => import('./views/roles/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Roles.Show],
      },
    },
    {
      path: '/settings/roles/:id',
      name: 'RolesView',
      component: () => import('./views/roles/view.vue'),
      meta: {
        returnUrl: '/settings/roles',
        requiresAuth: true,
        permissions: [Permissions.Roles.ShowDetails],
      },
    },
    {
      path: '/settings/sales-channels',
      name: 'SalesChannels',
      component: () => import('./views/salesChannels/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [],
      },
    },
    {
      path: '/settings/sales-channels/:id',
      name: 'SalesChannelsView',
      component: () => import('./views/salesChannels/view.vue'),
      meta: {
        returnUrl: '/settings/sales-channels',
        requiresAuth: true,
        permissions: [],
      },
    },
    {
      path: '/b2b/companies',
      name: 'CompaniesList',
      component: () => import('./views/b2b/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Roles.Show],
        disabled: () => accessor.config.env[FEATURE_FLAGS.B2B] !== '1',
      },
    },
    {
      path: '/b2b/companies/:id',
      name: 'CompanyView',
      component: () => import('./views/b2b/view.vue'),
      meta: {
        returnUrl: '/b2b/companies',
        requiresAuth: true,
        permissions: [Permissions.Roles.ShowDetails],
        disabled: () => accessor.config.env[FEATURE_FLAGS.B2B] !== '1',
      },
    },
    {
      path: '/settings/consents',
      name: 'Consents',
      component: () => import('./views/consents/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Consents.Show],
      },
    },
    {
      path: '/settings/consents/:id',
      name: 'ConsentsView',
      component: () => import('./views/consents/view.vue'),
      meta: {
        returnUrl: '/settings/consents',
        requiresAuth: true,
        permissions: [Permissions.Consents.Edit],
      },
    },
    {
      path: '/webhooks',
      name: 'WebHooks',
      component: () => import('./views/webhooks/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Webhooks.Show],
      },
    },
    {
      path: '/webhooks/:id',
      name: 'WebHooksView',
      component: () => import('./views/webhooks/view.vue'),
      meta: {
        returnUrl: '/webhooks',
        requiresAuth: true,
        permissions: [Permissions.Webhooks.Show],
      },
    },
    {
      path: '/settings/menu',
      name: 'Menu',
      component: () => import('./views/menu/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/403',
      name: 'Error403',
      component: () => import('./views/errors/403.vue'),
      meta: {
        hiddenNav: true,
      },
    },
    {
      path: '/*',
      name: 'Error404',
      component: () => import('./views/errors/404.vue'),
      meta: {
        hiddenNav: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)

  // Save prevoirous route for return to list button
  if (from.name)
    window.sessionStorage.setItem(
      'previousRoute',
      JSON.stringify({ path: from.path, fullPath: from.fullPath }),
    )

  const redirectIfLoggedIn = !!to.meta?.redirectIfLoggedIn || false
  const authRequired = !!to.meta?.requiresAuth || false
  const requiredPermissions: Permission[] = to.meta?.permissions || []

  if (redirectIfLoggedIn && accessor.auth.isLogged) {
    return next('/')
  }

  if (authRequired && !accessor.auth.isLogged) {
    accessor.auth.setPermissionsError(new Error('Not logged in'))
    return next({
      name: 'Login',
      query: { next: to.path !== '/' ? to.path : undefined },
    })
  }

  if (
    requiredPermissions.length > 0 &&
    !hasAccess(requiredPermissions)(accessor.auth.user?.permissions || [])
  ) {
    accessor.auth.setPermissionsError(new Error('Not authorized'))
    if (!from.name) next('/403')
    return
  }

  if (typeof to.meta?.disabled === 'function' ? to.meta?.disabled?.() : to.meta?.disabled) {
    return next('/404')
  }

  next()
})

export default router
