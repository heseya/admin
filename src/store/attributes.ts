import { createVuexCRUD } from './generator'

import {
  Attribute,
  AttributeDto,
  AttributeOption,
  AttributeOptionDto,
} from '@/interfaces/Attribute'
import { UUID } from '@/interfaces/UUID'
import { api } from '@/api'

type CreateOptionAction = { attributeId: UUID; option: AttributeOptionDto }
type CreateOptionMutation = { attributeId: UUID; option: AttributeOption }

type UpdateOptionAction = { attributeId: UUID; optionId: UUID; option: AttributeOptionDto }
type UpdateOptionMutation = { attributeId: UUID; optionId: UUID; option: AttributeOption }

export const attributes = createVuexCRUD<Attribute, AttributeDto, AttributeDto>()('attributes', {
  state: {},
  getters: {},
  mutations: {
    ADD_OPTION(state, { attributeId, option }: CreateOptionMutation) {
      const listItem = state.data.find(({ id }) => id === attributeId)
      if (listItem) (listItem.options as AttributeOption[]).push(option)
      if (state.selected.id === attributeId)
        (state.selected.options as AttributeOption[]).push(option)
    },

    UPDATE_OPTION(state, { attributeId, optionId, option }: UpdateOptionMutation) {
      const listItem = state.data.find(({ id }) => id === attributeId)
      if (listItem) {
        const optionIndex = listItem.options.findIndex((o) => o.id === optionId)
        if (optionIndex !== -1) (listItem.options as AttributeOption[])[optionIndex] = option
      }
      if (state.selected.id === attributeId) {
        const optionIndex = state.selected.options.findIndex((o) => o.id === optionId)
        if (optionIndex !== -1) (state.selected.options as AttributeOption[])[optionIndex] = option
      }
    },
  },
  actions: {
    async addOption({ commit }, { attributeId, option }: CreateOptionAction) {
      try {
        const { data } = await api.post<{ data: AttributeOption }>(
          `/attributes/id:${attributeId}/options`,
          option,
        )
        commit('ADD_OPTION', { attributeId, option: data.data })
        return { success: true, option: data.data } as const
      } catch (e) {
        return { success: false, error: e } as const
      }
    },

    async updateOption({ commit }, { attributeId, optionId, option }: UpdateOptionAction) {
      try {
        const { data } = await api.patch<{ data: AttributeOption }>(
          `/attributes/id:${attributeId}/options/id:${optionId}`,
          option,
        )
        commit('UPDATE_OPTION', { attributeId, option: data.data })
        return { success: true, option: data.data } as const
      } catch (e) {
        return { success: false, error: e } as const
      }
    },
  },
})
