import { createVuexCRUD, StoreMutations } from './generator'
import { api } from '../api'
import { Order } from '@/interfaces/Order'

export const orders = createVuexCRUD<Order>()('orders', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async changeStatus({ commit }, { orderId, statusId }) {
      commit(StoreMutations.SetError, null)
      try {
        await api.post(`/orders/id:${orderId}/status`, { status_id: statusId })
        return true
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return false
      }
    },
  },
})
