import { api } from '../api'

export const auth = {
  namespaced: true,
  state: {
    error: null,
    user: null,
    token: null
  },
  getters: {
    getToken(state) {
      return state.token
    },
    isLogged(state) {
      return !!state.user
    }
  },
  mutations: {
    SET_TOKEN(state, newToken) {
      state.token = newToken
    },
    SET_USER(state, newUser) {
      state.user = newUser
    },
    SET_ERROR(state, newError) {
      state.error = newError
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      commit('SET_ERROR', null)
      try {
        const { data } = await api.post('/login', { email, password })
        commit('SET_USER', data.data.user)
        commit('SET_TOKEN', data.data.token)
      } catch (e) {
        commit('SET_ERROR', e)
      }
    },
    async logout({ commit, dispatch }) {
      try {
        await api.post('/auth/logout')
        dispatch('clearAuth')
      } catch (e) {
        commit('SET_ERROR', e)
      }
    },
    clearAuth({ commit }) {
      commit('SET_ERROR', null)
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    }
  }
}
