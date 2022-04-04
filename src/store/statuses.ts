import { createVuexCRUD } from './generator'
import { OrderStatus, OrderStatusDto } from '@/interfaces/Order'
import { reorderCollection } from '@/services/reorderCollection'

export const statuses = createVuexCRUD<OrderStatus, OrderStatusDto, OrderStatusDto>()('statuses', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async reorder(_u, statuses) {
      await reorderCollection('statuses', 'statuses')(statuses)
    },
  },
})
