import { createStore } from './generator'
import { api } from '@/api'

export const statuses = createStore('STATUSES', 'statuses', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async setOrder({ commit }, statuses) {
      try {
        const { data } = await api.post('/statuses/order', { statuses })
        return data
      } catch (error) {
        return false
      }
    }
  }
})
