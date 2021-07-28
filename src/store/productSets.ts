import { ProductSet } from '@/interfaces/ProductSet'
import { createVuexCRUD } from './generator'

export const productSets = createVuexCRUD<ProductSet>()('product-sets', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
