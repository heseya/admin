import { Role, RoleCreateDto, RoleUpdateDto } from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'

export const b2bCompanies = createVuexCRUD<Role, RoleCreateDto, RoleUpdateDto>()(
  // B2B company is a role
  'roles',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
  {
    get: { lang_fallback: 'any', 'metadata.b2b_company': true },
    getOne: {
      ...GLOBAL_QUERY_PARAMS,
      'metadata.b2b_company': true,
    },
    add: GLOBAL_QUERY_PARAMS,
    edit: GLOBAL_QUERY_PARAMS,
    update: GLOBAL_QUERY_PARAMS,
  },
)
