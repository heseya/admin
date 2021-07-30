import Vue from 'vue'
import VueRouter from 'vue-router'
import { accessor } from './store'

Vue.use(VueRouter)

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
      path: '/items',
      name: 'Items',
      component: () => import('./views/items/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/schemas',
      name: 'Schemas',
      component: () => import('./views/schemas/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/schemas/:id',
      name: 'SchemaCiew',
      component: () => import('./views/schemas/view.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('./views/products/Index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/products/:id',
      name: 'ProductsView',
      component: () => import('./views/products/View.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('./views/orders/Index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/orders/:id',
      name: 'OrdersView',
      component: () => import('./views/orders/view.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/discounts',
      name: 'Discounts',
      component: () => import('./views/discounts/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/pages',
      name: 'Pages',
      component: () => import('./views/pages/Index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/pages/:id',
      name: 'PagesView',
      component: () => import('./views/pages/View.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/apps',
      name: 'Apps',
      component: () => import('./views/apps/index.vue'),
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
      path: '/settings/product-sets',
      name: 'ProductSets',
      component: () => import('./views/productSets/Index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/shipping-methods',
      name: 'ShippingMethods',
      component: () => import('./views/settings/ShippingMethods.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/statuses',
      name: 'Statuses',
      component: () => import('./views/settings/Statuses.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/tags',
      name: 'Tags',
      component: () => import('./views/settings/Tags.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/package-templates',
      name: 'PackageTemplates',
      component: () => import('./views/settings/PackageTemplates.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/advanced',
      name: 'PageSettings',
      component: () => import('./views/settings/Settings.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings/login-history',
      name: 'LoginHistory',
      component: () => import('./views/settings/LoginHistory.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)

  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    if (!accessor.auth.isLogged) {
      // User is not logged
      next({
        name: 'Login',
        params: { nextURL: to.fullPath },
      })
    } else {
      // User is logged
      next()
    }
  } else {
    // Path does not requires auth
    next()
  }
})

export default router
