/* eslint-disable camelcase */
import { actionTree, getterTree, mutationTree } from 'typed-vuex'
import { SeoMetadata } from '@heseya/store-core'

import { api, sdk } from '../api'
import { UUID } from '@/interfaces/UUID'

const state = () => ({
  error: null as null | Error,
  seo: null as null | SeoMetadata,
})

const getters = getterTree(state, {
  getGlobalSeo(state) {
    return state.seo
  },
})

const mutations = mutationTree(state, {
  SET_SEO(state, newSeo: SeoMetadata) {
    state.seo = newSeo
  },
  SET_ERROR(state, newError) {
    state.error = newError
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async get({ commit }) {
      commit('SET_ERROR', null)
      try {
        const seo = await sdk.GlobalSeo.get()

        commit('SET_SEO', seo)

        return seo
      } catch (e: any) {
        commit('SET_ERROR', e)
        return false
      }
    },
    async update({ commit }, payload: SeoMetadata) {
      commit('SET_ERROR', null)
      try {
        const {
          data: { data },
        } = await api.patch<{ data: SeoMetadata }>('/seo', payload)

        commit('SET_SEO', data)

        return data
      } catch (e: any) {
        commit('SET_ERROR', e)
        return false
      }
    },

    async checkDuplicates(
      _c,
      { keywords, excluded }: { keywords: string[]; excluded?: { id: UUID; model: string } },
    ) {
      type CheckResponse = { data: { duplicated: boolean; duplicates: [] } }

      try {
        const response = await api.post<CheckResponse>('/seo/check', {
          keywords,
          excluded,
        })

        return response.data.data
      } catch {
        return {
          duplicated: false,
          duplicates: [],
        }
      }
    },
  },
)

export const globalSeo = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
