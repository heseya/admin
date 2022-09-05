import { createVuexCRUD } from './generator'

import {
  Attribute,
  AttributeCreateDto,
  AttributeUpdateDto,
  AttributeOption,
  AttributeOptionDto,
  HeseyaResponseMeta,
} from '@heseya/store-core'
import { UUID } from '@/interfaces/UUID'
import { api, sdk } from '@/api'
import { stringifyQueryParams } from '@/utils/stringifyQuery'

type CreateOptionAction = { attributeId: UUID; option: AttributeOptionDto }
type UpdateOptionAction = { attributeId: UUID; optionId: UUID; option: AttributeOptionDto }
type DeleteOptionAction = { attributeId: UUID; optionId: UUID }

type UpdateOptionMutation = { optionId: UUID; option: AttributeOption }

export const attributes = createVuexCRUD<Attribute, AttributeCreateDto, AttributeUpdateDto>()(
  'attributes',
  {
    state: {
      optionsMeta: {} as HeseyaResponseMeta,
      options: [] as AttributeOption[],
    },
    getters: {},
    mutations: {
      SET_OPTIONS_META(state, meta: HeseyaResponseMeta) {
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
          // TODO: migrate meta to standard pagination interface
          const { data } = await api.get<{ data: AttributeOption[]; meta: HeseyaResponseMeta }>(
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
          const attr = await sdk.Attributes.addOption(attributeId, option)
          commit('ADD_OPTION', attr)
          return { success: true, option: attr }
        } catch (error) {
          return { success: false, error } as const
        }
      },

      async updateOption({ commit }, { attributeId, optionId, option }: UpdateOptionAction) {
        try {
          const attr = await sdk.Attributes.updateOption(attributeId, optionId, option)

          commit('UPDATE_OPTION', { optionId, option: attr })
          return { success: true, option: attr }
        } catch (error) {
          return { success: false, error } as const
        }
      },

      async deleteOption({ commit }, { attributeId, optionId }: DeleteOptionAction) {
        await sdk.Attributes.deleteOption(attributeId, optionId)
        commit('DELETE_OPTION', optionId)
        return true
      },
    },
  },
)
