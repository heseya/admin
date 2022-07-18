import { createVuexCRUD } from './generator'
import { OrderStatus, OrderStatusCreateDto, OrderStatusUpdateDto } from '@heseya/store-core'
import { reorderCollection } from '@/services/reorderCollection'

export const statuses = createVuexCRUD<OrderStatus, OrderStatusCreateDto, OrderStatusUpdateDto>()(
  'statuses',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {
      async reorder(_u, statuses) {
        await reorderCollection('statuses', 'statuses')(statuses)
      },
    },
  },
)
