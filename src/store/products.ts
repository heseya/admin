import { createVuexCRUD } from './generator'
import { api } from '../api'
import { ID } from '@/interfaces/ID'
import { Product } from '@/interfaces/Product'

export const products = createVuexCRUD<Product>()('products', {
  state: {
    depositError: null as null | Error,
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
    async updateQuantity({ commit }, { id, quantity }: { id: ID; quantity: number }) {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.post(`/items/id:${id}/deposits`, { quantity })
        return data
      } catch (error) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return false
      }
    },
  },
})
