import { Page, PageCreateDto, PageUpdateDto } from '@heseya/store-core'
import { reorderCollection } from '@/services/reorderCollection'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

export const pages = createVuexCRUD<Page, PageCreateDto, PageUpdateDto>()(
  'pages',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {
      async reorder(_u, pages) {
        await reorderCollection('pages', 'pages')(pages)
      },
    },
  },
  {
    get: { lang_fallback: 'any' },
    getOne: GLOBAL_QUERY_PARAMS,
    add: GLOBAL_QUERY_PARAMS,
    edit: GLOBAL_QUERY_PARAMS,
    update: GLOBAL_QUERY_PARAMS,
  },
)
