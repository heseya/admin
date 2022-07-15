import { PaymentMethod } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const paymentMethods = createVuexCRUD<PaymentMethod>()('payment-methods', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
