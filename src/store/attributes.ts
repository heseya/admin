import { createVuexCRUD } from './generator'

import {
  Attribute,
  AttributeDto,
  AttributeOption,
  AttributeOptionDto,
} from '@/interfaces/Attribute'
import { UUID } from '@/interfaces/UUID'
import { api } from '@/api'

export const attributes = createVuexCRUD<Attribute, AttributeDto, AttributeDto>()('attributes', {
  state: {},
  getters: {},
  mutations: {
    ADD_OPTION(state, { attributeId, option }: { attributeId: UUID; option: AttributeOption }) {
      const listItem = state.data.find(({ id }) => id === attributeId)
      if (listItem) (listItem.options as AttributeOption[]).push(option)
      if (state.selected.id === attributeId)
        (state.selected.options as AttributeOption[]).push(option)
    },
  },
  actions: {
    async addOption(
      { commit },
      { attributeId, option }: { attributeId: UUID; option: AttributeOptionDto },
    ) {
      try {
        const { data } = await api.post<{ data: AttributeOption }>(
          `/attributes/id:${attributeId}/options`,
          option,
        )
        commit('ADD_OPTION', { attributeId, option: data })
        return { success: true, option: data.data } as const
      } catch (e) {
        return { success: false, error: e } as const
      }
    },
  },
})
