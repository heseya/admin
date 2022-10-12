import { Role, RoleCreateDto, RoleUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const b2bCompanies = createVuexCRUD<Role, RoleCreateDto, RoleUpdateDto>()(
  // B2B company is a role
  'roles',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
  { get: { 'metadata.b2b_company': true } },
)
