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
    async updateOrganizations ({ commit }) {
      const response = await api.get('/organizations')
      console.log(response)
    }
  }
}
