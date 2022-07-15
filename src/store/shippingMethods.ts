import {
  ShippingMethod,
  ShippingMethodCreateDto,
  ShippingMethodUpdateDto,
} from '@heseya/store-core'
import { createVuexCRUD } from './generator'
import { reorderCollection } from '@/services/reorderCollection'

export const shippingMethods = createVuexCRUD<
  ShippingMethod,
  ShippingMethodCreateDto,
  ShippingMethodUpdateDto
>()('shipping-methods', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async reorder(_c, items) {
      await reorderCollection('shipping-methods', 'shipping_methods')(items)
    },
  },
})
