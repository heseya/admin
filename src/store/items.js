import { createStore } from './generator'
import { api } from '../api'

export const items = createStore('ITEMS', 'items', {
  state: {
    depositError: null
  },
  getters: {
    getDepositError(state) {
      return state.depositError
    }
  },
  mutations: {
    PRODUCTS_SET_DEPOSITS_ERROR(state, error) {
      state.depositError = error
    }
  },
  actions: {
    async updateQuantity({ commit }, { id, quantity }) {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.post(`/items/id:${id}/deposits`, { quantity })
        return data
      } catch (error) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return false
      }
    },
    async getQuantity({ commit }, id) {
      commit('PRODUCTS_SET_DEPOSITS_ERROR', null)
      try {
        const { data } = await api.get(`/items/id:${id}/deposits`)
        return data.data.reduce((acc, { quantity }) => acc + quantity, 0)
      } catch (error) {
        commit('PRODUCTS_SET_DEPOSITS_ERROR', error)
        return false
      }
    }
  }
})
