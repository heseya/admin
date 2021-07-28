<template>
  <div>
    <PaginatedList title="Kolekcje produktów" storeKey="productSets" draggable>
      <template #nav>
        <vs-button @click="openModal()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: set }">
        <list-item @click="openModal(set.id)" :hidden="!set.public">
          {{ set.name }}
          <small>{{ set.children.length }} subkolekcji</small>
        </list-item>
      </template>
    </PaginatedList>

    <ProductSetForm :value="editedItem" :is-open="isModalActive" @close="isModalActive = false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import ProductSetForm from '@/components/forms/productSets/Form.vue'

import { ID } from '@/interfaces/ID'
import { ProductSet } from '@/interfaces/ProductSet'

const CLEAR_FORM: ProductSet = {
  id: '',
  name: '',
  slug: '',
  slug_override: false,
  public: true,
  public_parent: false,
  hide_on_index: false,
  parent: null,
  children: [],
}

export default Vue.extend({
  components: {
    ListItem,
    PaginatedList,
    ProductSetForm,
  },
  data: () => ({
    isModalActive: false,
    editedItem: cloneDeep(CLEAR_FORM) as ProductSet,
  }),
  methods: {
    openModal(id: ID) {
      this.isModalActive = true
      if (id) {
        this.editedItem = this.$store.getters['productSets/getFromListById'](id)
      } else {
        this.editedItem = cloneDeep(CLEAR_FORM)
      }
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
