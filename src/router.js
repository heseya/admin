import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from './views/Orders.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('./views/products/Index.vue')
    },
    {
      path: '/products/view',
      name: 'ProductsForm',
      component: () => import('./views/products/View.vue')
    }
  ]
})

export default router
