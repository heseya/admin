import { createVuexCRUD } from './generator'
import { CreateUserDTO, EditUserDTO, User } from '@/interfaces/User'

export const users = createVuexCRUD<User, CreateUserDTO, EditUserDTO>()('users', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
