import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'
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
  {
    get: GLOBAL_QUERY_PARAMS,
    getOne: GLOBAL_QUERY_PARAMS,
    add: GLOBAL_QUERY_PARAMS,
    edit: GLOBAL_QUERY_PARAMS,
    update: GLOBAL_QUERY_PARAMS,
  },
)
