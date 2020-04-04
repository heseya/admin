import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from './views/Orders.vue'
import Products from './views/Products.vue'

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
      component: Products
    }
  ]
})

export default router
