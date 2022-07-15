import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import axios from 'axios'

import { useAccessor, getterTree, mutationTree, actionTree } from 'typed-vuex'

import { getApiURL } from '@/utils/api'

import { auth } from './auth'
import { globalSeo } from './globalSeo'
import { users } from './users'
import { banners } from './banners'
import { roles } from './roles'
import { consents } from './consents'
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
import { webhooks } from './webhooks'
import { coupons } from './coupons'
import { sales } from './sales'
import { tags } from './tags'
import { productSets } from './productSets'
import { attributes } from './attributes'
import { media } from './media'
import { menuItems } from './menuItems'

Vue.use(Vuex)

const state = () => ({
  loading: false,
  currency: 'PLN',
  env: {} as Record<string, string>,
})

export type RootState = ReturnType<typeof state>

const getters = getterTree(state, {})

const mutations = mutationTree(state, {
  SET_ENV(state, newEnv: Record<string, string>) {
    state.env = newEnv
  },
  SET_LOADING(state, loading: boolean) {
    state.loading = loading
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchEnv({ commit }) {
      // Fetch setting wtihout authorization, so it wont crash when auth is invalid
      const { data } = await axios.get<Record<string, string>>('/settings?array', {
        baseURL: getApiURL(),
      })
      commit('SET_ENV', data)
    },
    startLoading({ commit, state }) {
      if (!state.loading) commit('SET_LOADING', true)
    },
    stopLoading({ commit, state }) {
      if (state.loading) commit('SET_LOADING', false)
    },
  },
)

const storeModules = {
  auth,
  globalSeo,
  users,
  banners,
  roles,
  consents,
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
  coupons,
  sales,
  authSessions,
  apps,
  webhooks,
  tags,
  productSets,
  attributes,
  media,
  menuItems,
}

const storePattern = {
  state,
  getters,
  mutations,
  actions,
  modules: storeModules,
}

const store = new Vuex.Store({
  ...storePattern,
  plugins: [new VuexPersistence({ modules: ['auth', 'menuItems'] }).plugin],
})

export const accessor = useAccessor(store, storePattern)

export type AccessorType = typeof accessor
export type StoreModulesKeys = keyof typeof storeModules
export type GeneratedStoreModulesKeys = Exclude<
  StoreModulesKeys,
  'auth' | 'globalSeo' | 'menuItems'
>

Vue.prototype.$accessor = accessor

export default store
