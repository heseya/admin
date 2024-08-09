import { PriceMapCreateDto, PriceMapUpdateDto } from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

import { PriceMap } from '@heseya/store-core'

export const priceMaps = createVuexCRUD<PriceMap, PriceMapCreateDto, PriceMapUpdateDto>()(
  'price-maps',
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
