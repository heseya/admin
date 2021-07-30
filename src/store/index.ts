import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { useAccessor, getterTree, mutationTree, actionTree } from 'typed-vuex'

import { api } from '../api'

import { Setting } from '@/interfaces/Settings'

import { auth } from './auth'
import { items } from './items'
import { products } from './products'
import { schemas } from './schemas'
import { pages } from './pages'
import { orders } from './orders'
import { statuses } from './statuses'
import { shippingMethods } from './shippingMethods'
import { paymentMethods } from './paymentMethods'
import { packageTemplates } from './packageTemplates'
import { settings } from './settings'
import { authSessions } from './authSessions'
import { apps } from './apps'
import { discounts } from './discounts'
import { tags } from './tags'
import { productSets } from './productSets'

Vue.use(Vuex)

const state = () => ({
  loading: false,
  currency: 'zł',
  env: {} as Record<string, string>,
})

export type RootState = ReturnType<typeof state>

const getters = getterTree(state, {})

const mutations = mutationTree(state, {
  SET_ENV(state, newEnv) {
    state.env = newEnv
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchEnv({ commit }) {
      const response = await api.get<{ data: Setting[] }>('/settings')
      const settingsArray = response.data.data
      const settings = Object.fromEntries(settingsArray.map(({ name, value }) => [name, value]))
      commit('SET_ENV', settings)
    },
    startLoading({ commit, state }) {
      if (!state.loading) commit('SET_LOADING', true)
    },
    stopLoading({ commit, state }) {
      if (state.loading) commit('SET_LOADING', false)
    },
  },
)

const storePattern = {
  state,
  getters,
  mutations,
  actions,
  modules: {
    auth,
    items,
    schemas,
    products,
    pages,
    orders,
    shippingMethods,
    statuses,
    paymentMethods,
    packageTemplates,
    settings,
    discounts,
    authSessions,
    apps,
    tags,
    productSets,
  },
}

const store = new Vuex.Store({
  ...storePattern,
  plugins: [new VuexPersistence({ modules: ['auth'] }).plugin],
})

export const accessor = useAccessor(store, storePattern)

Vue.prototype.$accessor = accessor

export default store
