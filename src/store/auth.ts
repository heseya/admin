/* eslint-disable camelcase */
import { actionTree, getterTree, mutationTree } from 'typed-vuex'
import {
  User,
  UserProfileUpdateDto,
  AuthProviderKey,
  PERMISSIONS_TREE,
  MetadataUpdateDto,
  HeseyaClientErrorCode,
  formatApiError,
} from '@heseya/store-core'
import { sdk } from '../api'

import { UUID } from '@/interfaces/UUID'
import { hasAccess } from '@/utils/hasAccess'
import { accessor } from '.'
import { broadcastTokensUpdate } from '@/utils/authSync'
import { LoginState } from '@/enums/login'
import { AxiosResponse } from 'axios'
import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'

interface PasswordLoginRequest {
  email: string
  password: string
  code?: string
}

interface ProviderLoginRequest {
  provider: AuthProviderKey
  returnUrl: string
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
  SET_USER(state, newUser: User | null) {
    state.user = newUser
  },
  SET_USER_PROFILE(state, newProfile) {
    if (state.user) {
      state.user.name = newProfile.name
      state.user.preferences = newProfile.preferences
    }
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
  SET_USER_TFA(state, isActive) {
    state.user!.is_tfa_active = isActive
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async login({ commit, dispatch }, payload: PasswordLoginRequest | ProviderLoginRequest) {
      commit('SET_ERROR', null)
      try {
        const isPasswordLogin = 'password' in payload

        const { user, ...tokens } = isPasswordLogin
          ? await sdk.Auth.login(payload.email, payload.password, payload.code)
          : await sdk.Auth.Providers.login(payload.provider, payload.returnUrl)

        if (!hasAccess(PERMISSIONS_TREE.Admin.Login)(user.permissions))
          throw new Error('errors.CLIENT_ERROR.NO_ADMIN_PERMISSIONS')

        commit('SET_USER', user)
        broadcastTokensUpdate(tokens)
        dispatch('setTokens', tokens)

        // side effect
        dispatch('menuItems/initMicrofrontendMenuItems', null, { root: true })
        dispatch('config/fetchCurrencies', null, { root: true })
        dispatch('config/initLanguages', null, { root: true })

        return {
          state: LoginState.Success,
          user,
        } as const
      } catch (e: any) {
        const response: AxiosResponse = e.response

        // Two-Factor Authentication
        if (response?.status === 403 && response?.data?.data?.type) {
          return {
            state: LoginState.TwoFactorAuthRequired,
            method: response.data.data.type as TwoFactorAuthMethod,
          } as const
        }

        // Account Merge is required due to multiple accounts with the same email
        if (formatApiError(e).key === HeseyaClientErrorCode.AlreadyHasAccount) {
          return {
            state: LoginState.AccountMergeRequired,
            mergeToken: response.data?.error?.errors?.merge_token as string,
          } as const
        }

        commit('SET_ERROR', e)
        return { state: LoginState.Error, error: e } as const
      }
    },

    async refreshToken({ commit, getters: get, dispatch }) {
      commit('SET_ERROR', null)

      try {
        if (!get.getRefreshToken) throw new Error('Refresh Token does not exist')

        const { user, ...tokens } = await sdk.Auth.refreshToken(get.getRefreshToken)
        const { accessToken, identityToken } = tokens

        commit('SET_USER', user)
        broadcastTokensUpdate(tokens)
        dispatch('setTokens', tokens)

        return {
          success: true as const,
          accessToken,
          identityToken,
        }
      } catch (e: any) {
        commit('SET_ERROR', e)
        return { success: false as const }
      }
    },

    setTokens(
      { commit },
      {
        accessToken,
        identityToken,
        refreshToken,
      }: { accessToken: string | null; identityToken: string | null; refreshToken: string | null },
    ) {
      commit('SET_ACCESS_TOKEN', accessToken)
      commit('SET_IDENTITY_TOKEN', identityToken)
      commit('SET_REFRESH_TOKEN', refreshToken)
    },

    async fetchProfile({ commit }) {
      commit('SET_ERROR', null)
      try {
        const profile = await sdk.UserProfile.get()
        commit('SET_USER', profile as User)
      } catch (e: any) {
        commit('SET_ERROR', e)
      }
    },

    async updateUserProfile({ commit }, payload: UserProfileUpdateDto) {
      commit('SET_ERROR', null)
      try {
        const profile = await sdk.UserProfile.update(payload)
        commit('SET_USER_PROFILE', profile)
        return profile
      } catch (e: any) {
        commit('SET_ERROR', e)
        return false
      }
    },

    // Metadata
    async updateMetadata({ commit }, { metadata }: { metadata: MetadataUpdateDto }) {
      commit('SET_ERROR', null)
      try {
        const data = await sdk.UserProfile.updateMetadataPersonal(metadata)
        return data.data
      } catch (error: any) {
        commit('SET_ERROR', error)
        return {}
      }
    },

    async changePassword(
      _u,
      { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    ) {
      return sdk.UserProfile.changePassword({ currentPassword: oldPassword, newPassword })
    },

    async logout({ commit, dispatch }) {
      accessor.startLoading()
      try {
        await sdk.Auth.logout()
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

    async requestResetPassword(
      { commit },
      { email, redirectUrl }: { email: string; redirectUrl?: string },
    ) {
      commit('SET_ERROR', null)
      try {
        await sdk.Auth.requestResetPassword(
          email,
          redirectUrl || `${window.location.origin}/new-password`,
        )
        return true
      } catch (e: any) {
        commit('SET_ERROR', e)
        return false
      }
    },
    async resetPassword({ commit }, payload: { token: string; email: string; password: string }) {
      commit('SET_ERROR', null)
      try {
        await sdk.Auth.resetPassword(payload)
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
