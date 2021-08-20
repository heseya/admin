import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { api } from '../api'

import { User } from '@/interfaces/User'
import { UUID } from '@/interfaces/UUID'
import { ALL_PERMISSIONS, PERMISSIONS_TREE } from '@/consts/permissions'
import { hasAccess } from '@/utils/hasAccess'

const state = () => ({
  error: null as null | Error,
  permissionsError: null as null | Error,
  user: null as null | User,
  token: null as null | string,
})

//! debug purpose only
const overrideUserPermissions = (user: User): User => {
  const OVERRIDE = true
  const ADD_ALL = true
  const CUSTOM = ['xd']

  return {
    ...user,
    permissions: !OVERRIDE ? user.permissions : ADD_ALL ? ALL_PERMISSIONS : (CUSTOM as any),
  }
}

const getters = getterTree(state, {
  getToken(state) {
    return state.token
  },
  isLogged(state) {
    return !!state.user
  },
  hasRole(state) {
    return (roleId: UUID) => !!state.user?.roles.find((r) => r.id === roleId) || false
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
        const { data } = await api.post<{ data: { user: User; token: string } }>('/login', {
          email,
          password,
        })

        //! debug purpose only
        data.data.user = overrideUserPermissions(data.data.user)

        if (!hasAccess(PERMISSIONS_TREE.Admin.Login)(data.data.user.permissions))
          throw new Error('Unauthorized')

        commit('SET_USER', data.data.user)
        commit('SET_TOKEN', data.data.token)
        return data.data.user
      } catch (e) {
        commit('SET_ERROR', e)
        return false
      }
    },
    async fetchProfile({ commit, state }) {
      if (!state.user?.id) return
      commit('SET_ERROR', null)
      try {
        const { data } = await api.get<{ data: User }>(`/users/id:${state.user.id}`) // /auth/profile

        //! debug purpose only
        data.data = overrideUserPermissions(data.data)

        commit('SET_USER', data.data)
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
