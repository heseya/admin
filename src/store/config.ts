/* eslint-disable camelcase */
import axios from 'axios'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { accessor } from './index'
import { getApiURL } from '@/utils/api'
import { getDefaultLanguage } from '@/utils/i18n'

const state = () => ({
  currency: 'PLN',
  apiLanguage: null as null | string,
  uiLanguage: getDefaultLanguage(),
  env: {} as Record<string, string>,
})

const getters = getterTree(state, {})

const mutations = mutationTree(state, {
  SET_ENV(state, newEnv: Record<string, string>) {
    state.env = newEnv
  },
  SET_API_LANGUAGE(state, language: string) {
    state.apiLanguage = language
  },
  SET_UI_LANGUAGE(state, language: string) {
    state.uiLanguage = language
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchEnv({ commit }) {
      // Fetch setting wtihout authorization, so it wont crash when auth is invalid
      const { data } = await axios.get<Record<string, string>>(`${getApiURL()}/settings?array`)
      commit('SET_ENV', data)
    },

    async initLanguages({ state, commit }) {
      const languages = await accessor.languages.fetch()
      if (languages && !state.apiLanguage) {
        const defaultLang = languages.find((l) => l.default)
        if (defaultLang) commit('SET_API_LANGUAGE', defaultLang.iso)
      }
    },
  },
)

export const config = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
