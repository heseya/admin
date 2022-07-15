import { Sale, SaleCreateDto, SaleUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const sales = createVuexCRUD<Sale, SaleCreateDto, SaleUpdateDto>()('sales', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
