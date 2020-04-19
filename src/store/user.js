import { api } from '../api'

export const user = {
  namespaced: true,
  state: {
    error: null,
    user: null,
    token: null
  },
  getters: {
    getToken (state) {
      return state.token
    },
    isLogged (state) {
      return true
      // TODO: replace when auth connected
      // return !!state.user
    }
  },
  mutations: {
    SET_TOKEN (state, newToken) {
      state.token = newToken
    },
    SET_USER (state, newUser) {
      state.user = newUser
    },
    SET_ERROR (state, newError) {
      state.error = newError
    }
  },
  actions: {
    async login ({ commit }, { username, password }) {
      commit('SET_ERROR', null)
      try {
        const { data } = await api.post('/login', { username, password })
        commit('SET_USER', data.data.user)
        commit('SET_TOKEN', data.data.token)
      } catch (e) {
        commit('SET_ERROR', e)
      }
    },
    logout ({ commit }) {
      commit('SET_ERROR', null)
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    }
  }
}
