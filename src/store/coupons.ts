import { Coupon, CouponCreateDto, CouponUpdateDto } from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

export const coupons = createVuexCRUD<Coupon, CouponCreateDto, CouponUpdateDto>()(
  'coupons',
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
