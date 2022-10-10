import { PaymentMethod, PaymentMethodCreateDto, PaymentMethodUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const paymentMethods = createVuexCRUD<
  PaymentMethod,
  PaymentMethodCreateDto,
  PaymentMethodUpdateDto
>()('payment-methods', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
