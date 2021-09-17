import { createVuexCRUD } from './generator'
import { OrderStatus } from '@/interfaces/Order'
import { reorderCollection } from '@/services/reorderCollection'

export const statuses = createVuexCRUD<OrderStatus>()('statuses', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async reorder(_u, statuses) {
      await reorderCollection('statuses', 'statuses', 'order')(statuses)
    },
  },
})
