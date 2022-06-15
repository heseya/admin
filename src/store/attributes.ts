import { createVuexCRUD } from './generator'

import {
  Attribute,
  AttributeCreateDto,
  AttributeUpdateDto,
  AttributeOption,
  AttributeOptionDto,
} from '@heseya/store-core'
import { UUID } from '@/interfaces/UUID'
import { api } from '@/api'
import { stringifyQueryParams } from '@/utils/stringifyQuery'
import { ResponseMeta } from '@/interfaces/Response'

type CreateOptionAction = { attributeId: UUID; option: AttributeOptionDto }
type UpdateOptionAction = { attributeId: UUID; optionId: UUID; option: AttributeOptionDto }
type DeleteOptionAction = { attributeId: UUID; optionId: UUID }

type UpdateOptionMutation = { optionId: UUID; option: AttributeOption }

export const attributes = createVuexCRUD<Attribute, AttributeCreateDto, AttributeUpdateDto>()(
  'attributes',
  {
    state: {
      optionsMeta: {} as ResponseMeta,
      options: [] as AttributeOption[],
    },
    getters: {},
    mutations: {
      SET_OPTIONS_META(state, meta: ResponseMeta) {
        state.optionsMeta = meta
      },
      SET_OPTIONS(state, options: AttributeOption[]) {
        state.options = options
      },
      ADD_OPTION(state, option: AttributeOption) {
        state.options = [...state.options, option]
      },
      UPDATE_OPTION(state, { optionId, option }: UpdateOptionMutation) {
        const index = state.options.findIndex((o) => o.id === optionId)
        if (index >= 0) state.options[index] = option
      },
      DELETE_OPTION(state, optionId: UUID) {
        state.options = state.options.filter((o) => o.id !== optionId)
      },
    },
    actions: {
      async getOptions(
        { commit },
        { attributeId, params }: { attributeId: UUID; params: Record<string, any> },
      ) {
        try {
          const queryString = stringifyQueryParams(params)
          const { data } = await api.get<{ data: AttributeOption[]; meta: ResponseMeta }>(
            `/attributes/id:${attributeId}/options${queryString}`,
          )
          commit('SET_OPTIONS_META', data.meta)
          commit('SET_OPTIONS', data.data)
          return data.data
        } catch {
          return false
        }
      },

      async addOption({ commit }, { attributeId, option }: CreateOptionAction) {
        try {
          const { data } = await api.post<{ data: AttributeOption }>(
            `/attributes/id:${attributeId}/options`,
            option,
          )
          commit('ADD_OPTION', data.data)
          return { success: true, option: data.data }
        } catch (error) {
          return { success: false, error } as const
        }
      },

      async updateOption({ commit }, { attributeId, optionId, option }: UpdateOptionAction) {
        try {
          const { data } = await api.patch<{ data: AttributeOption }>(
            `/attributes/id:${attributeId}/options/id:${optionId}`,
            option,
          )
          commit('UPDATE_OPTION', { optionId, option: data.data })
          return { success: true, option: data.data }
        } catch (error) {
          return { success: false, error } as const
        }
      },

      async deleteOption({ commit }, { attributeId, optionId }: DeleteOptionAction) {
        await api.delete(`/attributes/id:${attributeId}/options/id:${optionId}`)
        commit('DELETE_OPTION', optionId)
        return true
      },
    },
  },
)
