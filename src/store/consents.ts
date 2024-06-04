import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'
import { Consent, ConsentCreateDto, ConsentUpdateDto } from '@heseya/store-core'

export const consents = createVuexCRUD<Consent, ConsentCreateDto, ConsentUpdateDto>()(
  'consents',
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
