import { Page, PageDto } from '@/interfaces/Page'
import { reorderCollection } from '@/services/reorderCollection'
import { createVuexCRUD } from './generator'

export const pages = createVuexCRUD<Page, PageDto>()('pages', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async reorder(_u, pages) {
      await reorderCollection('pages', 'pages')(pages)
    },
  },
})
