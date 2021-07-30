import { createVuexCRUD } from './generator'
import { ShippingMethod } from '@/interfaces/ShippingMethod'
import { reorderCollection } from '@/services/reorderCollection'

export const shippingMethods = createVuexCRUD<ShippingMethod>()('shipping-methods', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // eslint-disable-next-line camelcase
    async reorder({ commit }, items) {
      await reorderCollection('shipping-methods', 'shipping_methods', 'order')(items)
    },
  },
})
