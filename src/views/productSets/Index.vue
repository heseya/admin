<template>
  <div>
    <PaginatedList title="Kolekcje produktów" store-key="productSets" draggable>
      <template #nav>
        <icon-button v-can="$p.ProductSets.Add" @click="createProductSet()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj kolekcję
        </icon-button>
      </template>

      <template v-slot="{ item: set }">
        <ProductSet
          :set="set"
          @edit="editProductSet"
          @create="createProductSet"
          @showProducts="showSetProducts"
        />
      </template>
    </PaginatedList>

    <ProductSetForm
      :value="editedItem"
      :slug-prefix="editedItemSlugPrefix"
      :is-open="isFormModalActive"
      :disabled="!$can(editedItem.id ? $p.ProductSets.Edit : $p.ProductSets.Add)"
      :deletable="$can($p.ProductSets.Remove)"
      @close="isFormModalActive = false"
    />

    <SetProductsList :set="selectedSet" :is-open="!!selectedSet" @close="selectedSet = null" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ProductSetForm from '@/components/modules/productSets/Form.vue'
import ProductSetComponent from '@/components/modules/productSets/ProductSet.vue'
import SetProductsList from '@/components/modules/productSets/SetProductsList.vue'
import IconButton from '@/components/layout/IconButton.vue'

import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'

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
    SetProductsList,
    IconButton,
  },
  data: () => ({
    isFormModalActive: false,
    selectedSet: null as null | ProductSet,
    editedItem: cloneDeep(CLEAR_FORM) as ProductSetDTO,
    editedItemSlugPrefix: '',
  }),
  methods: {
    editProductSet(set: ProductSet) {
      this.editedItem = {
        ...cloneDeep(set),
        parent_id: set.parent?.id || null,
        children_ids: set.children.map((child) => child.id),
      }
      this.editedItemSlugPrefix = set.parent?.slug || ''
      this.isFormModalActive = true
    },
    createProductSet(parent: ProductSet | null = null) {
      this.editedItem = {
        ...cloneDeep(CLEAR_FORM),
        parent_id: parent?.id || null,
      }
      this.editedItemSlugPrefix = parent?.slug || ''
      this.isFormModalActive = true
    },
    showSetProducts(set: ProductSet) {
      this.selectedSet = set
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isFormModalActive) {
      this.isFormModalActive = false
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
