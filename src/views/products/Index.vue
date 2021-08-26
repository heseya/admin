<template>
  <div class="products-container" :class="{ 'products-container--grid-view': !listView }">
    <PaginatedList title="Asortyment" :filters="filters" store-key="products">
      <template #nav>
        <icon-button @click="listView = !listView">
          <template #icon>
            <i v-if="!listView" class="bx bx-list-ul"></i>
            <i v-else class="bx bx-grid"></i>
          </template>
          Przełącz na widok {{ listView ? 'siatki' : 'listy' }}
        </icon-button>

        <icon-button @click="areFiltersOpen = true">
          <template #icon><i class="bx bx-filter-alt"></i></template>
          Otwórz filtry
        </icon-button>

        <icon-button to="/products/create">
          <template #icon><i class="bx bx-plus"></i></template>
          Dodaj produkt
        </icon-button>
      </template>

      <template v-slot="{ item: product }">
        <ProductTile v-if="!listView" :product="product" />
        <ProductListItem v-else :product="product" />
      </template>
    </PaginatedList>

    <vs-dialog v-model="areFiltersOpen" width="550px" not-center>
      <template #header>
        <h4>Filtry</h4>
      </template>
      <modal-form>
        <products-filter :filters="filters" @search="makeSearch" />
      </modal-form>
    </vs-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import ProductTile from '@/components/modules/products/ProductTile.vue'
import ProductListItem from '@/components/modules/products/ProductListItem.vue'
import ProductsFilter, {
  EMPTY_PRODUCT_FILTERS,
} from '@/components/modules/products/ProductsFilter.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import { formatFilters } from '@/utils/utils'
import IconButton from '@/components/layout/IconButton.vue'

const LOCAL_STORAGE_KEY = 'products-list-view'

export default Vue.extend({
  components: {
    ProductTile,
    ProductListItem,
    ProductsFilter,
    ModalForm,
    PaginatedList,
    IconButton,
  },
  data: () => ({
    filters: { ...EMPTY_PRODUCT_FILTERS },
    areFiltersOpen: false,
    listView: false,
  }),
  watch: {
    listView(listView: boolean) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, String(Number(listView)))
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.sets = (this.$route.query.set as string) || ''
    // for future purposes, when we'll be able to filter by more than one set
    // const sets = this.$route.query.set || []
    // this.filters.sets = isArray(sets) ? (sets as string[]) : [sets]

    this.listView = !!+(window.localStorage.getItem(LOCAL_STORAGE_KEY) || 0)
  },
  methods: {
    makeSearch(filters: typeof EMPTY_PRODUCT_FILTERS) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'products',
        query: { page: undefined, ...queryFilters },
      })
    },
  },
})
</script>

<style lang="scss">
.products-container {
  &--grid-view {
    .card {
      padding: 0;
      background-color: #fff0;
      box-shadow: none;
      border: none;
    }

    .paginated-list__list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-gap: 22px;
      padding: 0;
      min-height: 100px;
      margin-bottom: 12px;
      align-items: start;
    }
  }
}
</style>
