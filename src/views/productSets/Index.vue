<template>
  <div>
    <PaginatedList
      title="Kolekcje produktów"
      storeKey="productSets"
      :params="{ tree: 1 }"
      draggable
    >
      <template #nav>
        <vs-button @click="createProductSet()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: set }">
        <list-item @click="editProductSet(set.id)" :hidden="!set.public">
          {{ set.name }}
          <small>{{ set.children.length }} subkolekcji</small>
        </list-item>
      </template>
    </PaginatedList>

    <ProductSetForm
      :value="editedItem"
      :slugPrefix="editedItemSlugPrefix"
      :is-open="isModalActive"
      @close="isModalActive = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import ProductSetForm from '@/components/forms/productSets/Form.vue'

import { ID } from '@/interfaces/ID'
import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'

const CLEAR_FORM: ProductSetDTO = {
  id: '',
  name: '',
  slug: '',
  slug_override: false,
  public: true,
  hide_on_index: false,
  parent_id: null,
  children_ids: [],
}

export default Vue.extend({
  components: {
    ListItem,
    PaginatedList,
    ProductSetForm,
  },
  data: () => ({
    isModalActive: false,
    editedItemSlugPrefix: '',
    editedItem: cloneDeep(CLEAR_FORM) as ProductSetDTO,
  }),
  methods: {
    editProductSet(id: ID) {
      const editedItem = this.$accessor.productSets.getFromListById(id)
      this.editedItem = {
        ...cloneDeep(editedItem),
        parent_id: editedItem.parent?.id || null,
        children_ids: editedItem.children.map((child) => child.id),
      }
      this.editedItemSlugPrefix = editedItem.parent?.slug || ''
      this.isModalActive = true
    },
    createProductSet(parent: ProductSet | null = null) {
      this.editedItem = {
        ...cloneDeep(CLEAR_FORM),
        parent_id: parent?.id || null,
      }
      this.editedItemSlugPrefix = parent?.slug || ''
      this.isModalActive = true
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) {
      this.isModalActive = false
      next(false)
    } else {
      next()
    }
  },
})
</script>
