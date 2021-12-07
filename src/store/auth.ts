/* eslint-disable camelcase */
import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { api } from '../api'

import { User } from '@/interfaces/User'
import { UUID } from '@/interfaces/UUID'
import { PERMISSIONS_TREE } from '@/consts/permissions'
import { hasAccess } from '@/utils/hasAccess'
import { accessor } from '.'
import { broadcastTokensUpdate } from '@/utils/authSync'

interface AuthResponse {
  user: User
  token: string
  identity_token: string
  refresh_token: string
}

const state = () => ({
  error: null as null | Error,
  permissionsError: null as null | Error,
  user: null as null | User,

  tokens: {
    accessToken: null as null | string,
    identityToken: null as null | string,
    refreshToken: null as null | string,
  },
})

const getters = getterTree(state, {
  getAccessToken(state) {
    return state.tokens.accessToken
  },
  getIdentityToken(state) {
    return state.tokens.identityToken
  },
  getRefreshToken(state) {
    return state.tokens.refreshToken
  },
  isLogged(state, get) {
    return !!state.user && !!get.getAccessToken
  },
  hasRole(state) {
    return (roleId: UUID) => !!state.user?.roles.find((r) => r.id === roleId) || false
  },
})

const mutations = mutationTree(state, {
  SET_USER(state, newUser) {
    state.user = newUser
  },

  SET_ACCESS_TOKEN(state, newToken = null) {
    state.tokens.accessToken = newToken
  },
  SET_IDENTITY_TOKEN(state, newToken = null) {
    state.tokens.identityToken = newToken
  },
  SET_REFRESH_TOKEN(state, newToken = null) {
    state.tokens.refreshToken = newToken
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
    async login({ commit, dispatch }, { email, password }: { email: string; password: string }) {
      commit('SET_ERROR', null)
      try {
        const {
          data: { data },
        } = await api.post<{ data: AuthResponse }>('/login', {
          email,
          password,
        })

        if (!hasAccess(PERMISSIONS_TREE.Admin.Login)(data.user.permissions))
          throw new Error('Unauthorized')

        commit('SET_USER', data.user)

        const tokens = {
          accessToken: data.token,
          identityToken: data.identity_token,
          refreshToken: data.refresh_token,
        }
        broadcastTokensUpdate(tokens)
        dispatch('setTokens', tokens)

        return data.user
      } catch (e: any) {
        commit('SET_ERROR', e)
        return false
      }
    },

    async refreshToken({ commit, getters: get, dispatch }) {
      commit('SET_ERROR', null)

      try {
        if (!get.getRefreshToken) throw new Error('Refresh Token does not exist')

        const {
          data: { data },
        } = await api.post<{ data: AuthResponse }>('/auth/refresh', {
          refresh_token: get.getRefreshToken,
        })

        const tokens = {
          accessToken: data.token,
          identityToken: data.identity_token,
          refreshToken: data.refresh_token,
        }
        broadcastTokensUpdate(tokens)
        dispatch('setTokens', tokens)

        return {
          success: true as const,
          accessToken: data.token,
          identityToken: data.identity_token,
        }
      } catch (e: any) {
        commit('SET_ERROR', e)
        return { success: false as const }
      }
    },

    setTokens({ commit }, { accessToken, identityToken, refreshToken }) {
      commit('SET_ACCESS_TOKEN', accessToken)
      commit('SET_IDENTITY_TOKEN', identityToken)
      commit('SET_REFRESH_TOKEN', refreshToken)
    },

    async fetchProfile({ commit }) {
      commit('SET_ERROR', null)
      try {
        const { data } = await api.get<{ data: User }>(`/auth/profile`)

        commit('SET_USER', data.data)
      } catch (e: any) {
        commit('SET_ERROR', e)
      }
    },

    async changePassword(
      _u,
      { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    ) {
      return api.patch('users/password', {
        password: oldPassword,
        password_new: newPassword,
        password_confirmation: newPassword,
      })
    },

    async logout({ commit, dispatch }) {
      accessor.startLoading()
      try {
        await api.post('/auth/logout')
      } catch (e: any) {
        commit('SET_ERROR', e)
      } finally {
        dispatch('clearAuth')
        broadcastTokensUpdate(null)
      }
      accessor.stopLoading()
    },

    clearAuth({ commit, dispatch }) {
      commit('SET_ERROR', null)
      commit('SET_USER', null)

      dispatch('setTokens', {
        accessToken: null,
        identityToken: null,
        refreshToken: null,
      })
    },

    setPermissionsError({ commit }, error: Error) {
      commit('SET_PERMISSIONS_ERROR', error)
    },

    async requestResetPassword({ commit }, { email }: { email: string }) {
      commit('SET_ERROR', null)
      try {
        await api.post('/users/reset-password', { email })
        return true
      } catch (e: any) {
        commit('SET_ERROR', e)
        return false
      }
    },
    async resetPassword({ commit }, payload: { token: string; email: string; password: string }) {
      commit('SET_ERROR', null)
      try {
        await api.patch('/users/save-reset-password', payload)
        return true
      } catch (e: any) {
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
