import { api } from './../api'

export const products = {
  namespaced: true,
  state: {
    products: []
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async index ({ commit, state }) {
      const response = await api.get('/products')
      state.products = response.data.data
      console.log(response)
    }
  }
}
