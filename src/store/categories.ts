import { createStore } from './generator'
import { api } from '@/api'

export const categories = createStore('CATEGORIES', 'categories', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async setOrder({ commit }, categories) {
      try {
        const { data } = await api.post('/categories/order', { categories })
        return data
      } catch (error) {
        return false
      }
    }
  }
})
