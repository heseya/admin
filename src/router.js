import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from './views/Orders.vue'

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
      path: '/orders',
      name: 'Orders',
      component: Orders,
      meta: {
        requiresAuth: true
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
      path: '/products/:slug',
      name: 'ProductsForm',
      component: () => import('./views/products/View.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // if (to.matched.some(rec => rec.meta.requiresAuth)) {
  //   return next({
  //     name: 'Login',
  //     params: { nextURL: to.fullPath }
  //   })
  // }

  return next()
})

export default router
