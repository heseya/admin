import { Sale, SaleCreateDto, SaleUpdateDto } from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

export const sales = createVuexCRUD<Sale, SaleCreateDto, SaleUpdateDto>()(
  'sales',
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
