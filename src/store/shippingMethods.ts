import { createVuexCRUD } from './generator'
import { ShippingMethod, ShippingMethodDTO as DTO } from '@/interfaces/ShippingMethod'
import { reorderCollection } from '@/services/reorderCollection'

export const shippingMethods = createVuexCRUD<ShippingMethod, DTO, DTO>()('shipping-methods', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async reorder(_c, items) {
      await reorderCollection('shipping-methods', 'shipping_methods', 'order')(items)
    },
  },
})
