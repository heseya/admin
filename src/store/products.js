import { api } from './../api'

export const products = {
  namespaced: true,
  state: {
    products: [],
    selectedProduct: {}
  },
  getters: {},
  mutations: {
    setProducts (state, payload = []) {
      state.products = payload
    },
    setSelectedProduct (state, payload) {
      state.selectedProduct = payload
    }
  },
  actions: {
    async index ({ commit }) {
      const response = await api.get('/products')

      commit('setProducts', response.data.data)
    },
    async view ({ commit }, id) {
      const response = await api.get(`/products/id:${id}`)

      commit('setSelectedProduct', response.data.data)
    }
  }
}
