import { api } from '@/api'
import { createVuexCRUD } from './generator'

import { ID } from '@/interfaces/ID'
import { AuthSession } from '@/interfaces/AuthSession'

export const loginHistory = createVuexCRUD<AuthSession>()('auth/login-history', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async kill({ state, commit }, id: ID) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await api.get(`/auth/kill-session/id:${id}`)

        const killedSession = state.data.find((s) => s.id === id)!
        commit('EDIT_DATA', { key: 'id', value: id, item: { ...killedSession, revoked: true } })

        commit('SET_LOADING', false)
        return true
      } catch (error) {
        commit('SET_ERROR', error)
        commit('SET_LOADING', false)
        return false
      }
    },
    async killAll({ state, commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        await api.get(`/auth/kill-all-sessions`)

        commit(
          'SET_DATA',
          state.data.map((s) => ({ ...s, revoked: !s.current_session })),
        )

        commit('SET_LOADING', false)
        return true
      } catch (error) {
        commit('SET_ERROR', error)
        commit('SET_LOADING', false)
        return false
      }
    },
  },
})
