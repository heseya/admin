import { createVuexCRUD } from './generator'
import { sdk } from '../api'

import {
  WarehouseDeposit,
  WarehouseDepositDto,
  WarehouseItem,
  WarehouseItemCreateDto,
  WarehouseItemUpdateDto,
} from '@heseya/store-core'

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
    PRODUCTS_SET_DEPOSITS_ERROR(state, error: Error | null) {
      state.depositError = error
    },
  },
  actions: {
    async createDeposit(
      { commit, dispatch, state },
      { id, deposit }: { id: string; deposit: WarehouseDepositDto },
    ): Promise<WarehouseDeposit | false> {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const newDeposit = await sdk.Warehouse.createDeposit(id, deposit)

        await Promise.all([dispatch('fetch', state.queryParams), dispatch('get', id)])

        return newDeposit
      } catch (error: any) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return false
      }
    },

    async getDeposits({ commit }, id: string): Promise<WarehouseDeposit[]> {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        return await sdk.Warehouse.getItemDeposits(id)
      } catch (error: any) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return []
      }
    },
  },
})
