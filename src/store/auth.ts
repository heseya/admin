import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { api } from '../api'

import { User } from '@/interfaces/User'

const state = () => ({
  error: null as null | Error,
  permissionsError: null as null | Error,
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
  SET_PERMISSIONS_ERROR(state, newError) {
    state.permissionsError = newError
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
    async fetchProfile({ commit, state }) {
      commit('SET_ERROR', null)
      try {
        // TODO: unhide when endpoint below will be ready
        // const { data } = await api.get<{ data: User }>('/auth/profile')
        // commit('SET_USER', data.data)

        // debug purpose only
        commit('SET_USER', { ...state.user, permissions: ['settings.show', 'settings.add'] })
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
    setPermissionsError({ commit }, error: Error) {
      commit('SET_PERMISSIONS_ERROR', error)
    },

    async requestResetPassword({ commit }, { email }: { email: string }) {
      commit('SET_ERROR', null)
      try {
        await api.post('/users/reset-password', { email })
        return true
      } catch (e) {
        commit('SET_ERROR', e)
        return false
      }
    },
    async resetPassword({ commit }, payload: { token: string; email: string; password: string }) {
      commit('SET_ERROR', null)
      try {
        await api.patch('/users/save-reset-password', payload)
        return true
      } catch (e) {
        commit('SET_ERROR', e)
        return false
      }
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
