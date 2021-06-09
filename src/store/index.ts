import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { api } from '../api'

import { Setting } from '@/interfaces/Settings'

import { auth } from './auth'
import { items } from './items'
import { products } from './products'
import { schemas } from './schemas'
import { pages } from './pages'
import { brands } from './brands'
import { categories } from './categories'
import { orders } from './orders'
import { statuses } from './statuses'
import { shippingMethods } from './shippingMethods'
import { paymentMethods } from './paymentMethods'
import { packageTemplates } from './packageTemplates'
import { settings } from './settings'
import { loginHistory } from './loginHistory'
import { apps } from './apps'
import { discounts } from './discounts'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currency: 'zł',
    env: {} as Record<string, string>,
  },
  mutations: {
    SET_ENV(state, newEnv) {
      state.env = newEnv
    },
  },
  actions: {
    async fetchEnv({ commit }) {
      const response = await api.get<{ data: Setting[] }>('/settings')
      const settingsArray = response.data.data
      const settings = Object.fromEntries(settingsArray.map(({ name, value }) => [name, value]))
      commit('SET_ENV', settings)
    },
  },
  modules: {
    auth,
    items,
    schemas,
    products,
    pages,
    brands,
    categories,
    orders,
    shippingMethods,
    statuses,
    paymentMethods,
    packageTemplates,
    settings,
    discounts,
    loginHistory,
    apps,
  },
  plugins: [new VuexPersistence({ modules: ['auth'] }).plugin],
})
