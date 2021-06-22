import { createVuexCRUD } from './generator'

export const loginHistory = createVuexCRUD('LOGIN-HISTORY', 'auth/login-history', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
