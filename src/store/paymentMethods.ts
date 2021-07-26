import { PaymentMethod } from '@/interfaces/PaymentMethod'
import { createVuexCRUD } from './generator'

export const paymentMethods = createVuexCRUD<PaymentMethod>()('payment-methods', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
