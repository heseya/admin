import { Product, ProductCreateDto, ProductUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const products = createVuexCRUD<Product, ProductCreateDto, ProductUpdateDto>()('products', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
