import { ProductSet } from '@/interfaces/ProductSet'
import { createVuexCRUD } from './generator'
import { findInTree, removeFromTree, updateItemInTree } from '@/utils/tree'
import { ID } from '@/interfaces/ID'

const PARAM = { tree: 1 }

export const productSets = createVuexCRUD<ProductSet>()(
  'product-sets',
  {
    state: {},
    getters: {},
    mutations: {
      ADD_DATA(state, newSet: ProductSet) {
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

      EDIT_DATA(
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

      REMOVE_DATA(state, { value: id }: { value: ID }) {
        state.data = removeFromTree(state.data, id)
      },
    },
    actions: {},
  },
  { get: PARAM, edit: PARAM, update: PARAM },
)
