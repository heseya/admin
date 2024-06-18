import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

import { SalesChannel, SalesChannelCreateDto, SalesChannelUpdateDto } from '@heseya/store-core'

export const salesChannels = createVuexCRUD<
  SalesChannel,
  SalesChannelCreateDto,
  SalesChannelUpdateDto
>()(
  'sales-channels',
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
