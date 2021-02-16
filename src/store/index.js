import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { auth } from './auth'
import { items } from './items'
import { products } from './products'
import { pages } from './pages'
import { brands } from './brands'
import { categories } from './categories'
import { orders } from './orders'
import { statuses } from './statuses'
import { shippingMethods } from './shippingMethods'
import { paymentMethods } from './paymentMethods'
import { packageTemplates } from './packageTemplates'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currency: 'zł'
  },
  mutations: {},
  actions: {},
  modules: {
    auth,
    items,
    products,
    pages,
    brands,
    categories,
    orders,
    shippingMethods,
    statuses,
    paymentMethods,
    packageTemplates
  },
  plugins: [new VuexPersistence({ modules: ['auth'] }).plugin]
})
