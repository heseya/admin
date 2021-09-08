import { api } from '@/api'
import { createVuexCRUD, StoreMutations } from './generator'

import { UUID } from '@/interfaces/UUID'
import { AuthSession } from '@/interfaces/AuthSession'

export const authSessions = createVuexCRUD<AuthSession>()('auth/login-history', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async kill({ state, commit }, id: UUID) {
      commit(StoreMutations.SetLoading, true)
      commit(StoreMutations.SetError, null)
      try {
        await api.get(`/auth/kill-session/id:${id}`)

        const killedSession = state.data.find((s) => s.id === id)!
        commit(StoreMutations.EditData, {
          key: 'id',
          value: id,
          item: { ...killedSession, revoked: true },
        })

        commit(StoreMutations.SetLoading, false)
        return true
      } catch (error) {
        commit(StoreMutations.SetError, error)
        commit(StoreMutations.SetLoading, false)
        return false
      }
    },
    async killAll({ state, commit }) {
      commit(StoreMutations.SetLoading, true)
      commit(StoreMutations.SetError, null)
      try {
        await api.get(`/auth/kill-all-sessions`)

        commit(
          StoreMutations.SetData,
          state.data.map((s) => ({ ...s, revoked: !s.current_session })),
        )

        commit(StoreMutations.SetLoading, false)
        return true
      } catch (error) {
        commit(StoreMutations.SetError, error)
        commit(StoreMutations.SetLoading, false)
        return false
      }
    },
  },
})
