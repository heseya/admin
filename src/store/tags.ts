import { Tag, TagCreateDto, TagUpdateDto } from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

export const tags = createVuexCRUD<Tag, TagCreateDto, TagUpdateDto>()(
  'tags',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
  {
    get: GLOBAL_QUERY_PARAMS,
    getOne: GLOBAL_QUERY_PARAMS,
    add: GLOBAL_QUERY_PARAMS,
    edit: GLOBAL_QUERY_PARAMS,
    update: GLOBAL_QUERY_PARAMS,
  },
)
