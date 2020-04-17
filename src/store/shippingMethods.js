import { api } from './../api'

export const shippingMethods = {
  namespaced: true,
  state: {
    shippingMethods: [],
    selectedShippingMethods: {}
  },
  getters: {},
  mutations: {
    setshippingMethods (state, payload = []) {
      state.shippingMethods = payload
    },
    setselectedShippingMethods (state, payload) {
      state.selectedShippingMethods = payload
    }
  },
  actions: {
    async index ({ commit }) {
      const response = await api.get('/shipping-methods')

      commit('setshippingMethods', response.data.data)
    },
    async view ({ commit }, id) {
      const response = await api.get(`/shipping-methods/id:${id}`)

      commit('setselectedShippingMethods', response.data.data)
    }
  }
}
