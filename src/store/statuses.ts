import { createVuexCRUD } from './generator'
import { api } from '@/api'
import { OrderStatus } from '@/interfaces/Order'

export const statuses = createVuexCRUD<OrderStatus>()('statuses', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async setOrder({ commit }, statuses) {
      try {
        const { data } = await api.post('/statuses/order', { statuses })
        return data
      } catch (error) {
        return false
      }
    },
  },
})
