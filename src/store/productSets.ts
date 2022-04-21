import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'
import { createVuexCRUD, StoreMutations } from './generator'
import { findInTree, removeFromTree, updateItemInTree } from '@/utils/tree'
import { UUID } from '@/interfaces/UUID'
import { reorderCollection } from '@/services/reorderCollection'
import { cloneDeep } from 'lodash'

const PARAM = { tree: 1 }

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
          state.data = [...state.data, newSet]
          return
        }

        // Set in the tree
        const parent = findInTree(state.data, newSet.parent.id)
        if (parent) {
          parent.children = [...parent.children, newSet]
        }
      },

      [StoreMutations.EditData](
        state,
        {
          key,
          value,
          item,
        }: { key: keyof ProductSet; value: unknown; item: Partial<ProductSet> & { id: UUID } },
      ) {
        // Edits selected item
        if (state.selected[key] === value) state.selected = { ...state.selected, ...item }

        // Edits tree of the items
        state.data = updateItemInTree(state.data, item)
      },

      [StoreMutations.RemoveData](state, { value: id }: { value: UUID }) {
        state.data = removeFromTree(state.data, id)
      },
    },
    actions: {
      async reorder(_u, productSets: UUID[]) {
        await reorderSets(productSets)
      },
      async reorderChildren({ state, commit }, { parentId, ids }: { parentId: UUID; ids: UUID[] }) {
        const success = await reorderSets(ids, parentId)
        if (!success) return

        const parent = cloneDeep(findInTree(state.data, parentId))
        if (!parent) return
        parent.children = ids.map((id) => parent.children.find((i) => i.id === id)!)

        commit(StoreMutations.EditData, { key: 'id', value: parentId, item: parent })
      },
    },
  },
  { get: PARAM, edit: PARAM, update: PARAM, add: PARAM },
)
