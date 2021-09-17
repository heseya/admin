import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import { Permission } from './interfaces/Permissions'

import { accessor } from './store'
import { hasAccess } from './utils/hasAccess'
import { PERMISSIONS_TREE as Permissions } from './consts/permissions'

Vue.use(VueRouter)
Vue.use(VueMeta)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      props: true,
      component: () => import('./views/auth/Login.vue'),
      meta: {
        hiddenNav: true,
        recaptchaAlert: true,
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      props: true,
      component: () => import('./views/auth/ResetPassword.vue'),
      meta: {
        hiddenNav: true,
        recaptchaAlert: true,
      },
    },
    {
      path: '/new-password',
      name: 'NewPassword',
      props: true,
      component: () => import('./views/auth/NewPassword.vue'),
      meta: {
        hiddenNav: true,
        recaptchaAlert: true,
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
      path: '/discounts',
      name: 'Discounts',
      component: () => import('./views/discounts/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Discounts.Show],
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
      path: '/apps',
      name: 'Apps',
      component: () => import('./views/apps/index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Apps.Show],
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
      path: '/collections',
      name: 'ProductSets',
      component: () => import('./views/productSets/Index.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.ProductSets.Show],
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
      path: '/settings/tags',
      name: 'Tags',
      component: () => import('./views/settings/Tags.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Tags.Show],
      },
    },
    {
      path: '/settings/package-templates',
      name: 'PackageTemplates',
      component: () => import('./views/settings/PackageTemplates.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Packages.Show],
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
      name: 'Users',
      component: () => import('./views/settings/Users.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Users.Show],
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
      path: '/settings/login-history',
      name: 'LoginHistory',
      component: () => import('./views/settings/LoginHistory.vue'),
      meta: {
        requiresAuth: true,
        permissions: [Permissions.Auth.SessionsShow],
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

  const authRequired = !!to.meta?.requiresAuth || false
  const requiredPermissions: Permission[] = to.meta?.permissions || []

  if (authRequired && !accessor.auth.isLogged) {
    accessor.auth.setPermissionsError(new Error('Not logged in'))
    return next({
      name: 'Login',
      params: { nextURL: to.fullPath },
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

  next()
})

export default router
