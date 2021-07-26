import { createVuexCRUD } from './generator'

export const loginHistory = createVuexCRUD()('auth/login-history', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
