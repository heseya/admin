import { Page, PageCreateDto, PageUpdateDto } from '@heseya/store-core'
import { reorderCollection } from '@/services/reorderCollection'
import { createVuexCRUD } from './generator'

export const pages = createVuexCRUD<Page, PageCreateDto, PageUpdateDto>()('pages', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async reorder(_u, pages) {
      await reorderCollection('pages', 'pages')(pages)
    },
  },
})
