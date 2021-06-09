import { createStore } from './generator'
import { api } from '../api'

export const orders = createStore('ORDERS', 'orders', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async changeStatus({ commit }, { orderId, statusId }) {
      commit('ORDERS_SET_ERROR', null)
      try {
        const { status } = await api.post(`/orders/id:${orderId}/status`, { status_id: statusId })
        return status === 204
      } catch (error) {
        commit('ORDERS_SET_ERROR', error)
        return false
      }
    }
  }
})
