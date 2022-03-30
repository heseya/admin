import { Coupon, CouponDto } from '@/interfaces/SalesAndCoupons'
import { createVuexCRUD } from './generator'

export const coupons = createVuexCRUD<Coupon, CouponDto, CouponDto>()('coupons', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
