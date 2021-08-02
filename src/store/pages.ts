import { reorderCollection } from '@/services/reorderCollection'
import { createVuexCRUD } from './generator'

export const pages = createVuexCRUD()('pages', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async reorder(_u, pages) {
      await reorderCollection('pages', 'pages', 'order')(pages)
    },
  },
})
