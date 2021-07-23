import { api } from '@/api'
import { createVuexCRUD } from './generator'

export const pages = createVuexCRUD('PAGES', 'pages', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async setOrder(_u, pages) {
      try {
        const { data } = await api.post('/pages/order', { pages })
        return data
      } catch (error) {
        return false
      }
    },
  },
})
