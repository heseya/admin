import { createVuexCRUD } from './generator'
import { api } from '../api'

import {
  WarehouseDeposit,
  WarehouseDepositDto,
  WarehouseItem,
  WarehouseItemCreateDto,
  WarehouseItemUpdateDto,
} from '../interfaces/WarehouseItem'

export const items = createVuexCRUD<
  WarehouseItem,
  WarehouseItemCreateDto,
  WarehouseItemUpdateDto
>()('items', {
  state: {
    depositError: null as Error | null,
  },
  getters: {
    getDepositError(state) {
      return state.depositError
    },
  },
  mutations: {
    PRODUCTS_SET_DEPOSITS_ERROR(state, error) {
      state.depositError = error
    },
  },
  actions: {
    async updateQuantity(
      { commit },
      { id, deposit }: { id: string; deposit: WarehouseDepositDto },
    ): Promise<WarehouseDeposit | false> {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.post<{ data: WarehouseDeposit }>(
          `/items/id:${id}/deposits`,
          deposit,
        )
        return data.data
      } catch (error: any) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return false
      }
    },

    async getDeposits({ commit }, id: string): Promise<WarehouseDeposit[]> {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.get<{ data: WarehouseDeposit[] }>(`/items/id:${id}/deposits`)
        return data.data
      } catch (error: any) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return []
      }
    },
  },
})
