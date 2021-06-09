import { createStore } from './generator'
import { api } from '@/api'

export const shippingMethods = createStore('SHIPPING_METHODS', 'shipping-methods', {
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
})
