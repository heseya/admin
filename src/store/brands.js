import { createStore } from './generator'
import { api } from '@/api'

export const brands = createStore('BRANDS', 'brands', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async setOrder({ commit }, brands) {
      try {
        const { data } = await api.post('/brands/order', { brands })
        return data
      } catch (error) {
        return false
      }
    }
  }
})
