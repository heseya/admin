import { PaymentMethod } from '@/interfaces/PaymentMethod'
import { createVuexCRUD } from './generator'

export const paymentMethods = createVuexCRUD<PaymentMethod>('PAYMENT_METHODS', 'payment-methods', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
