import axios from 'axios'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { accessor } from './index'
import { getApiURL } from '@/utils/api'
import { getDefaultUiLanguage } from '@/utils/i18n'

const state = () => ({
  currency: 'PLN',
  apiLanguage: null as null | string,
  uiLanguage: getDefaultUiLanguage(),
  // TODO: should be renamed to 'settings'
  env: {} as Record<string, string>,
})

const getters = getterTree(state, {})

const mutations = mutationTree(state, {
  SET_SETTINGS(state, newSettings: Record<string, string>) {
    state.env = newSettings
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
    async fetchSettings({ commit }) {
      // Fetch setting wtihout authorization, so it wont crash when auth is invalid
      const { data } = await axios.get<Record<string, string>>(`${getApiURL()}/settings?array`)
      commit('SET_SETTINGS', data)
    },

    async initLanguages({ state, commit }) {
      const languages = await accessor.languages.fetch()
      if (!languages) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch languages')
        return
      }

      const apiLanguage = languages.find(({ iso }) => iso === state.apiLanguage)

      if (!state.apiLanguage || !apiLanguage) {
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
