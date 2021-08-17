import { createVuexCRUD } from './generator'
import { api } from '../api'
import { UUID } from '@/interfaces/UUID'
import { Product, ProductDTO } from '@/interfaces/Product'

export const products = createVuexCRUD<Product, ProductDTO, ProductDTO>()('products', {
  state: {
    depositError: null as null | Error,
  },
  getters: {
    getDepositError(state) {
      return state.depositError
    },
  },
  mutations: {
    SET_DEPOSITS_ERROR(state, error) {
      state.depositError = error
    },
  },
  actions: {
    async updateQuantity({ commit }, { id, quantity }: { id: UUID; quantity: number }) {
      commit('SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.post(`/items/id:${id}/deposits`, { quantity })
        return data
      } catch (error) {
        commit('SET_DEPOSITS_ERROR', error)
        return false
      }
    },
  },
})
