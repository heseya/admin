import { api } from './../api'

export const pages = {
  namespaced: true,
  state: {
    pages: [],
    selectedPage: {}
  },
  getters: {},
  mutations: {
    setPages (state, payload = []) {
      state.pages = payload
    },
    setSelectedPage (state, payload) {
      state.selectedPage = payload
    }
  },
  actions: {
    async index ({ commit }) {
      const response = await api.get('/pages')

      commit('setPages', response.data.data)
    },
    async view ({ commit }, id) {
      const response = await api.get(`/pages/id:${id}`)

      commit('setSelectedPage', response.data.data)
    }
  }
}
