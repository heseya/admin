import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'
import { createVuexCRUD, StoreMutations } from './generator'
import { UUID } from '@/interfaces/UUID'
import { reorderCollection } from '@/services/reorderCollection'

const PARAM = { root: 1, tree: 0 }

const reorderSets = reorderCollection('product-sets', 'product_sets')

export const productSets = createVuexCRUD<ProductSet, ProductSetDTO, ProductSetDTO>()(
  'product-sets',
  {
    state: {},
    getters: {},
    mutations: {
      [StoreMutations.AddData](state, newSet: ProductSet) {
        // Root level set
        if (!newSet.parent) {
          state.data = [...state.data, { ...newSet, children_ids: [] }]
        }
      },

      [StoreMutations.EditData](state, { item }: { item: Partial<ProductSet> & { id: UUID } }) {
        // Root level set
        if (!item.parent) {
          state.data = state.data.map((state) => {
            if (state.id === item.id) return { ...state, ...item }
            return state
          })
        } else state.data = state.data.filter((state) => state.id !== item.id)
      },

      [StoreMutations.RemoveData](state, { value: id }: { value: UUID }) {
        state.data = state.data.filter((state) => state.id !== id)
      },
    },
    actions: {
      async reorder(_u, productSets: UUID[]) {
        await reorderSets(productSets)
      },
      async reorderChildren({}, { parentId, ids }: { parentId: UUID; ids: UUID[] }) {
        const success = await reorderSets(ids, parentId)
        if (!success) return
      },
    },
  },
  { get: PARAM, edit: PARAM, update: PARAM, add: PARAM },
)
