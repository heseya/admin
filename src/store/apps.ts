import { createStore } from './generator'
import { api } from '@/api'

export const apps = createStore('APPS', 'apps', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async addApp({ commit }, url) {
      try {
        const { data } = await api.post('/apps', { url: url })
        return data
      } catch (error) {
        return false
      }
    },
  },
})
