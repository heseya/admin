/* eslint-disable camelcase */
import axios from 'axios'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'

// import { accessor } from './index'
import { getApiURL } from '@/utils/api'

const state = () => ({
  currency: 'PLN',
  apiLanguage: 'pl',
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
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchEnv({ commit }) {
      // Fetch setting wtihout authorization, so it wont crash when auth is invalid
      const { data } = await axios.get<Record<string, string>>(`${getApiURL()}/settings?array`)
      commit('SET_ENV', data)
    },

    // async initLanguages({ commit }) {
    //   const languages = await accessor.languages.fetch()
    //   if (languages) {
    //     const defaultLang = languages.find((l) => l.default)
    //     if (defaultLang) commit('SET_API_LANGUAGE', defaultLang.iso)
    //   }
    // },
  },
)

export const config = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
