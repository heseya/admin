import { createVuexCRUD } from './generator'
import { User } from '@/interfaces/User'

export const users = createVuexCRUD<User>()('users', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
