import { PaymentMethod } from '@/interfaces/PaymentMethod'
import { createVuexCRUD } from './generator'

export const media = createVuexCRUD<PaymentMethod>()('media', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
