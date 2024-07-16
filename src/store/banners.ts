import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

import { Banner, BannerCreateDto, BannerUpdateDto } from '@heseya/store-core'

export const banners = createVuexCRUD<Banner, BannerCreateDto, BannerUpdateDto>()(
  'banners',
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
