<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="productSets" :params="{ tree: 0 }" draggable>
      <template #nav>
        <icon-button v-can="$p.ProductSets.Add" @click="createProductSet()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: set }">
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

<i18n>
{
  "pl": {
    "title": "Kolekcje produktów",
    "add": "Dodaj kolekcję"
  },
  "en": {
    "title": "Collections",
    "add": "Add collection"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep, isString } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ProductSetForm, { CLEAR_PRODUCT_SET_FORM } from '@/components/modules/productSets/Form.vue'
import ProductSetComponent from '@/components/modules/productSets/ProductSet.vue'
import SetProductsList from '@/components/modules/productSets/SetProductsList.vue'

import { ProductSet, ProductSetDTO } from '@/interfaces/ProductSet'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    ProductSetForm,
    ProductSet: ProductSetComponent,
    SetProductsList,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isFormModalActive) {
      this.isFormModalActive = false
      next(false)
    } else {
      next()
    }
  },
  data: () => ({
    isFormModalActive: false,
    selectedSet: null as null | ProductSet,
    editedItem: cloneDeep(CLEAR_PRODUCT_SET_FORM) as ProductSetDTO,
    editedItemSlugPrefix: '',
  }),
  mounted() {
    if (this.$route.query.open) {
      this.editProductSet(this.$route.query.open as string)
    }
  },
  methods: {
    editProductSet(set: ProductSet | string) {
      if (isString(set)) {
        this.editedItem = { id: set } as ProductSetDTO
      } else {
        this.editedItem = {
          ...cloneDeep(set),
          parent_id: set.parent?.id || null,
          attributes: set.attributes?.map((attr) => attr.id) || [],
        }
        this.editedItemSlugPrefix = set.parent?.slug || ''
      }
      this.isFormModalActive = true
    },
    createProductSet(parent: ProductSet | null = null) {
      this.editedItem = {
        ...cloneDeep(CLEAR_PRODUCT_SET_FORM),
        parent_id: parent?.id || null,
      }
      this.editedItemSlugPrefix = parent?.slug || ''
      this.$nextTick(() => {
        this.isFormModalActive = true
      })
    },
    showSetProducts(set: ProductSet) {
      this.selectedSet = set
    },
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
