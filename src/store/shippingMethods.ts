import { createVuexCRUD } from './generator'
import { api } from '@/api'
import { ShippingMethod } from '@/interfaces/ShippingMethod'

export const shippingMethods = createVuexCRUD<ShippingMethod>(
  'SHIPPING_METHODS',
  'shipping-methods',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {
      // eslint-disable-next-line camelcase
      async setOrder({ commit }, shipping_methods) {
        try {
          const { data } = await api.post('/shipping-methods/order', { shipping_methods })
          return data
        } catch (error) {
          return false
        }
      },
    },
  },
)
