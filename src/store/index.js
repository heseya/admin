import Vue from 'vue'
import Vuex from 'vuex'

import { products } from './products'
import { pages } from './pages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    products,
    pages
  }
})
