import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      props: true,
      component: () => import('./views/Login.vue'),
      meta: {
        hiddenNav: true,
        recaptchaAlert: true
      }
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('./views/products/Index.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/products/:id',
      name: 'ProductsView',
      component: () => import('./views/products/View.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('./views/orders/Index.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/orders/:id',
      name: 'OrdersView',
      component: () => import('./views/orders/view.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chats',
      name: 'Chats',
      component: () => import('./views/chats/Index.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/pages',
      name: 'Pages',
      component: () => import('./views/pages/Index.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/pages/:id',
      name: 'PagesView',
      component: () => import('./views/pages/View.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('./views/Settings.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/brands',
      name: 'Brands',
      component: () => import('./views/Brands.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/categories',
      name: 'Categories',
      component: () => import('./views/Categories.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings/shipping-methods',
      name: 'ShippingMethods',
      component: () => import('./views/ShippingMethods.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    if (!store.getters['auth/isLogged']) {
      // User is not logged
      next({
        name: 'Login',
        params: { nextURL: to.fullPath }
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
