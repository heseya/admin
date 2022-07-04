import { createVuexCRUD } from './generator'
import { AuthProvider } from '@/interfaces/Providers'

export const providers = createVuexCRUD<AuthProvider & { id: AuthProvider['key'] }>()(
  'auth/providers',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
)
