<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title').toString()"
      store-key="productSets"
      :filters="filters"
      draggable
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.ProductSets.Add" to="/collections/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <sets-filter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: set }">
        <ProductSet
          class="product-parent"
          :set="set"
          @edit="editProductSet"
          @create="createProductSet"
          @show-products="showSetProducts"
        />
      </template>
    </PaginatedList>

    <SetProductsList :set="selectedSet" :is-open="!!selectedSet" @close="selectedSet = null" />
  </div>
</template>

<i18n lang="json">
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
import { defineComponent } from 'vue'
import { cloneDeep, isNil, isString } from 'lodash'
import { CdnMedia, ProductSet, ProductSetUpdateDto } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ProductSetComponent from '@/components/modules/productSets/ProductSet.vue'
import SetProductsList from '@/components/modules/productSets/SetProductsList.vue'
import ProductSetsFilter, {
  EMPTY_PRODUCT_SET_FILTERS,
  ProductSetFilters,
} from '@/components/modules/productSets/ProductSetsFilter.vue'
import { CLEAR_PRODUCT_SET_FORM } from './View.vue'

import { UUID } from '@/interfaces/UUID'
import { formatFilters } from '@/utils/utils'
import { ALL_FILTER_VALUE } from '@/consts/filters'
import { ProductSetListed } from '@heseya/store-core'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    ProductSet: ProductSetComponent,
    SetProductsList,
    SetsFilter: ProductSetsFilter,
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
    selectedSet: null as null | ProductSetListed,
    editedItem: cloneDeep(CLEAR_PRODUCT_SET_FORM) as ProductSetUpdateDto & {
      id?: UUID
      cover: CdnMedia | null
    },
    editedItemSlugPrefix: '',
    filters: { ...EMPTY_PRODUCT_SET_FILTERS },
  }),
  mounted() {
    if (this.$route.query.open) {
      this.editProductSet(this.$route.query.open as string)
    }
  },
  created() {
    const { search, public: isPublic, root } = this.$route.query

    this.filters.public = (isPublic as string) || ALL_FILTER_VALUE
    this.filters.search = (search as string) || ''
    this.filters.root = !isNil(root) ? (root as string) === 'true' : true
  },
  methods: {
    editProductSet(set: ProductSet | string) {
      if (isString(set)) {
        this.editedItem = { id: set } as ProductSetUpdateDto & { id: UUID; cover: CdnMedia | null }
      } else {
        this.editedItem = {
          ...cloneDeep(set),
          seo: cloneDeep(set.seo) || undefined,
          cover: set.cover || null,
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
    clearFilters() {
      this.makeSearch(cloneDeep(EMPTY_PRODUCT_SET_FILTERS))
    },
    makeSearch(filters: ProductSetFilters) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'collections',
        query: { ...queryFilters, page: undefined },
      })
    },
    showSetProducts(set: ProductSetListed) {
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

.product-parent {
  border-bottom: solid 1px #eceef5 !important;
}
</style>
