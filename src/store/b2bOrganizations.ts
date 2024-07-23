import {
  HeseyaPaginatedResponseMeta,
  OrganizationCreateDto,
  OrganizationUpdateDto,
  SalesChannelStatus,
} from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'
import { DefaultVuexMutation } from '@/interfaces/VuexGenerator'
import { Organization, OrganizationListed } from '@heseya/store-core'

// TODO: remove mock
const mockOrganization = (): Organization => ({
  consents: [],
  id: Math.random().toString().replace('0.', ''),
  client_id: '123456',
  billing_email: 'test@heseya.com',
  billing_address: {
    address: 'Ulica 20',
    city: 'Warszawa',
    country: 'PL',
    country_name: 'Poland',
    name: 'Super Firma sp. z o.o.',
    phone: '500 500 500',
    zip: '00-000',
    vat: 'PL1234567890',
  },
  sales_channel: {
    status: SalesChannelStatus.Active,
    vat_rate: '23',
    default_currency: undefined as any,
    default_language: undefined as any,
    countries_block_list: false,
    countries: [],
    id: 'asdasdasdas',
    slug: 'org',
    name: 'Organizacja',
    published: [],
  },
})

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
    actions: {
      async fetch({ commit }) {
        commit(DefaultVuexMutation.SetError, null)
        commit(DefaultVuexMutation.SetLoading, true)

        const data: { data: OrganizationListed[]; meta: HeseyaPaginatedResponseMeta } = {
          data: [mockOrganization(), mockOrganization(), mockOrganization()],
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: '',
            per_page: 24,
            to: 1,
            total: 3,
            language: {} as any,
          },
        }

        commit(DefaultVuexMutation.SetMeta, data.meta)
        commit(DefaultVuexMutation.SetData, data.data)
        commit(DefaultVuexMutation.SetLoading, false)
        return data.data
      },
      async get({ commit }, id: string) {
        commit(DefaultVuexMutation.SetError, null)
        commit(DefaultVuexMutation.SetLoading, true)
        try {
          const data: { data: Organization } = {
            data: {
              ...mockOrganization(),
              id,
            },
          }
          // @ts-ignore type is correct, but TS is screaming
          commit(DefaultVuexMutation.SetSelected, data.data)
          commit(DefaultVuexMutation.SetLoading, false)
          return data.data
        } catch (error: any) {
          commit(DefaultVuexMutation.SetError, error)
          commit(DefaultVuexMutation.SetLoading, false)
          return false
        }
      },
    },
  },
  {
    get: { lang_fallback: 'any' },
    getOne: GLOBAL_QUERY_PARAMS,
    add: GLOBAL_QUERY_PARAMS,
    edit: GLOBAL_QUERY_PARAMS,
    update: GLOBAL_QUERY_PARAMS,
  },
)
