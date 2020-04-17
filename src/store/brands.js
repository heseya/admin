import { api } from './../api'

export const brands = {
  namespaced: true,
  state: {
    brands: [],
    selectedBrand: {}
  },
  getters: {},
  mutations: {
    setBrands (state, payload = []) {
      state.brands = payload
    },
    setSelectedBrand (state, payload) {
      state.selectedBrand = payload
    }
  },
  actions: {
    async index ({ commit }) {
      const response = await api.get('/brands')

      commit('setBrands', response.data.data)
    },
    async view ({ commit }, id) {
      const response = await api.get(`/brands/id:${id}`)

      commit('setSelectedBrand', response.data.data)
    }
  }
}
