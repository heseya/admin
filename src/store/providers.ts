import { createVuexCRUD } from './generator'
import { AuthProvider, AuthProviderUpdateDto } from '@heseya/store-core'

export const providers = createVuexCRUD<
  AuthProvider & { id: AuthProvider['key'] },
  {},
  AuthProviderUpdateDto
>()('auth/providers', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
