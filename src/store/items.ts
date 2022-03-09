import { createVuexCRUD } from './generator'
import { api } from '../api'
import { ProductItem, ProductItemDto } from '@/interfaces/Product'

export const items = createVuexCRUD<ProductItem, ProductItemDto, ProductItemDto>()('items', {
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
    async updateQuantity({ commit }, { id, quantity }) {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.post(`/items/id:${id}/deposits`, { quantity })
        return data
      } catch (error: any) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return false
      }
    },
    async getQuantity({ commit }, id) {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.get<{ data: { quantity: number }[] }>(`/items/id:${id}/deposits`)
        return data.data.reduce((acc, { quantity }) => acc + quantity, 0)
      } catch (error: any) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return false
      }
    },
  },
})
