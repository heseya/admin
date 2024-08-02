import {
  HeseyaPaginatedResponseMeta,
  PriceMapCreateDto,
  PriceMapUpdateDto,
} from '@heseya/store-core'
import { GLOBAL_QUERY_PARAMS, createVuexCRUD } from './generator'
import { DefaultVuexMutation } from '@/interfaces/VuexGenerator'
import { PriceMap, PriceMapListed } from '@heseya/store-core'

// TODO: remove mock
const mockEntity = (): PriceMapListed => ({
  id: Math.random().toString().replace('0.', ''),
  name: 'Nazwa mapy cen',
  description: 'Opis mapy cen',
  currency: 'PLN',
  is_net: Math.random() > 0.5,
})

export const priceMaps = createVuexCRUD<PriceMap, PriceMapCreateDto, PriceMapUpdateDto>()(
  'price-maps',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {
      async fetch({ commit }) {
        commit(DefaultVuexMutation.SetError, null)
        commit(DefaultVuexMutation.SetLoading, true)

        const data: { data: PriceMapListed[]; meta: HeseyaPaginatedResponseMeta } = {
          data: [mockEntity(), mockEntity(), mockEntity()],
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
          const data: { data: PriceMapListed } = {
            data: {
              ...mockEntity(),
              id,
            },
          }
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
