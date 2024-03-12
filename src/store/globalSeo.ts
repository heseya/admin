import { actionTree, getterTree, mutationTree } from 'typed-vuex'
import { SeoCheckModelType, SeoMetadata } from '@heseya/store-core'

import { sdk } from '../api'
import { UUID } from '@/interfaces/UUID'
import { GLOBAL_QUERY_PARAMS } from './generator'

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
        const seo = await sdk.GlobalSeo.get(GLOBAL_QUERY_PARAMS)

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
        const updatedSeo = await sdk.GlobalSeo.update(payload, GLOBAL_QUERY_PARAMS)
        commit('SET_SEO', updatedSeo)
        return updatedSeo
      } catch (e: any) {
        commit('SET_ERROR', e)
        return false
      }
    },

    async checkDuplicates(
      _c,
      {
        keywords,
        excluded,
      }: { keywords: string[]; excluded?: { id: UUID; model: SeoCheckModelType } },
    ) {
      try {
        return await sdk.GlobalSeo.check(keywords, excluded)
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
