import { Schema, SchemaCreateDto, SchemaUpdateDto } from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

export const schemas = createVuexCRUD<Schema, SchemaCreateDto, SchemaUpdateDto>()(
  'schemas',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
  {
    get: { lang_fallback: 'any' },
    getOne: GLOBAL_QUERY_PARAMS,
    add: GLOBAL_QUERY_PARAMS,
    edit: GLOBAL_QUERY_PARAMS,
    update: GLOBAL_QUERY_PARAMS,
  },
)
