import { Coupon, CouponCreateDto, CouponUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const coupons = createVuexCRUD<Coupon, CouponCreateDto, CouponUpdateDto>()('coupons', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
