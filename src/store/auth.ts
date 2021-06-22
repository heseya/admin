import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { User } from '@/interfaces/User'
import { api } from '../api'

const state = () => ({
  error: null as null | Error,
  user: null as null | User,
  token: null as null | string,
})

const getters = getterTree(state, {
  getToken(state) {
    return state.token
  },
  isLogged(state) {
    return !!state.user
  },
})

const mutations = mutationTree(state, {
  SET_TOKEN(state, newToken) {
    state.token = newToken
  },
  SET_USER(state, newUser) {
    state.user = newUser
  },
  SET_ERROR(state, newError) {
    state.error = newError
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async login({ commit }, { email, password }: { email: string; password: string }) {
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
    },
  },
)

export const auth = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
