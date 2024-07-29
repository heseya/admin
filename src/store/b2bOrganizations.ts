import { OrganizationCreateDto, OrganizationUpdateDto } from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'
import { Organization } from '@heseya/store-core'

export const b2bOrganizations = createVuexCRUD<
  Organization,
  OrganizationCreateDto,
  OrganizationUpdateDto
>()(
  'organizations',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
  {
    get: { lang_fallback: 'any' },
    getOne: GLOBAL_QUERY_PARAMS,
    add: GLOBAL_QUERY_PARAMS,
    edit: GLOBAL_QUERY_PARAMS,
    update: GLOBAL_QUERY_PARAMS,
  },
)
