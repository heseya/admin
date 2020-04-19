import Vue from 'vue'
import Vuex from 'vuex'

import { products } from './products'
import { pages } from './pages'
import { brands } from './brands'
import { categories } from './categories'
import { orders } from './orders'
import { shippingMethods } from './shippingMethods'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    products,
    pages,
    brands,
    categories,
    orders,
    shippingMethods
  }
})
