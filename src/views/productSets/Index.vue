<template>
  <div>
    <PaginatedList title="Kolekcje produktów" storeKey="productSets" draggable>
      <template #nav>
        <vs-button @click="createProductSet()" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: set }">
        <ProductSet :set="set" @edit="editProductSet" @create="createProductSet" />
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
import ProductSetForm from '@/components/forms/productSets/Form.vue'

import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'
import ProductSetComponent from '@/components/ProductSet.vue'

const CLEAR_FORM: ProductSetDTO = {
  id: '',
  name: '',
  slug_suffix: '',
  slug_override: false,
  public: true,
  hide_on_index: false,
  parent_id: null,
  children_ids: [],
}

export default Vue.extend({
  components: {
    PaginatedList,
    ProductSetForm,
    ProductSet: ProductSetComponent,
  },
  data: () => ({
    isModalActive: false,
    editedItemSlugPrefix: '',
    editedItem: cloneDeep(CLEAR_FORM) as ProductSetDTO,
  }),
  methods: {
    editProductSet(set: ProductSet) {
      this.editedItem = {
        ...cloneDeep(set),
        parent_id: set.parent?.id || null,
        children_ids: set.children.map((child) => child.id),
      }
      this.editedItemSlugPrefix = set.parent?.slug || ''
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

<style lang="scss">
.product-set {
  &__actions {
    display: flex;
  }
}
</style>