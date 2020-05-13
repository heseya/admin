import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { auth } from './auth'
import { products } from './products'
import { pages } from './pages'
import { brands } from './brands'
import { categories } from './categories'
import { orders } from './orders'
import { shippingMethods } from './shippingMethods'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currency: 'zł'
  },
  mutations: {},
  actions: {},
  modules: {
    auth,
    products,
    pages,
    brands,
    categories,
    orders,
    shippingMethods
  },
  plugins: [new VuexPersistence({ modules: ['auth'] }).plugin]
})
