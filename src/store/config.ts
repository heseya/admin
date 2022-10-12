import axios from 'axios'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { getApiURL } from '@/utils/api'

const state = () => ({
  currency: 'PLN',
  // TODO: should be renamed to 'settings'
  env: {} as Record<string, string>,
})

const getters = getterTree(state, {})

const mutations = mutationTree(state, {
  SET_SETTINGS(state, newSettings: Record<string, string>) {
    state.env = newSettings
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
  },
)

export const config = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
