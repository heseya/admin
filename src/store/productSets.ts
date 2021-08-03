import { ProductSet } from '@/interfaces/ProductSet'
import { createVuexCRUD, StoreMutations } from './generator'
import { findInTree, removeFromTree, updateItemInTree } from '@/utils/tree'
import { ID } from '@/interfaces/ID'
import { reorderCollection } from '@/services/reorderCollection'
import { cloneDeep } from 'lodash'

const PARAM = { tree: 1 }

const reorderSets = reorderCollection('product-sets', 'product_sets')

export const productSets = createVuexCRUD<ProductSet>()(
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
        { key, value, item }: { key: keyof ProductSet; value: unknown; item: ProductSet },
      ) {
        if (state.selected[key] === value) {
          // Edits selected item
          state.selected = item
          return
        }

        state.data = updateItemInTree(state.data, item)
      },

      [StoreMutations.RemoveData](state, { value: id }: { value: ID }) {
        state.data = removeFromTree(state.data, id)
      },
    },
    actions: {
      async reorder(_u, productSets: ID[]) {
        await reorderSets(productSets)
      },
      async reorderChildren({ state, commit }, { parentId, ids }: { parentId: ID; ids: ID[] }) {
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
