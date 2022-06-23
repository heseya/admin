import { Sale, SaleDto } from '@/interfaces/SalesAndCoupons'
import { createVuexCRUD } from './generator'

export const sales = createVuexCRUD<Sale, SaleDto, SaleDto>()('sales', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
