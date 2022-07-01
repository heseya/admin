import { createVuexCRUD } from './generator'
import { AuthProvider } from '@/interfaces/Providers'

export const providers = createVuexCRUD<AuthProvider & { id: string }>()('auth/providers', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
