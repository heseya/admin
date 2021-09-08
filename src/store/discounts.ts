import { DiscountCode } from '@/interfaces/DiscountCode'
import { createVuexCRUD } from './generator'

export const discounts = createVuexCRUD<DiscountCode>()('discounts', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
