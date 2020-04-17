import { api } from './../api'

export const categories = {
  namespaced: true,
  state: {
    categories: [],
    selectedCategory: {}
  },
  getters: {},
  mutations: {
    setcategories (state, payload = []) {
      state.categories = payload
    },
    setselectedCategory (state, payload) {
      state.selectedCategory = payload
    }
  },
  actions: {
    async index ({ commit }) {
      const response = await api.get('/categories')

      commit('setcategories', response.data.data)
    },
    async view ({ commit }, id) {
      const response = await api.get(`/categories/id:${id}`)

      commit('setselectedCategory', response.data.data)
    }
  }
}
