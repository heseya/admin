import { createVuexCRUD, StoreMutations } from './generator'
import { api } from '../api'
import { Order } from '@/interfaces/Order'
import { downloadJsonAsFile } from '@/utils/download'

export const orders = createVuexCRUD<Order>()('orders', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async changeStatus({ commit }, { orderId, statusId }) {
      commit(StoreMutations.SetError, null)
      try {
        const { status } = await api.post(`/orders/id:${orderId}/status`, { status_id: statusId })
        return status === 204
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return false
      }
    },
  },
})
