<template>
  <div class="products-container" :class="{ 'products-container--grid-view': !listView }">
    <PaginatedList title="Asortyment" :filters="filters" storeKey="products">
      <template #nav>
        <vs-tooltip bottom>
          <vs-button color="dark" @click="listView = !listView" icon>
            <i v-if="!listView" class="bx bx-list-ul"></i>
            <i v-else class="bx bx-grid"></i>
          </vs-button>
          <template #tooltip> Przełącz na widok {{ listView ? 'siatki' : 'listy' }} </template>
        </vs-tooltip>

        <vs-button color="dark" @click="areFiltersOpen = true" icon>
          <i class="bx bx-filter-alt"></i>
        </vs-button>

        <vs-button to="/products/create" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: product }">
        <ProductTile v-if="!listView" :product="product" />
        <ProductListItem v-else :product="product" />
      </template>
    </PaginatedList>

    <vs-dialog width="550px" not-center v-model="areFiltersOpen">
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
import ProductTile from '@/components/ProductTile.vue'
import ProductListItem from '@/components/ProductListItem.vue'
import ProductsFilter, { EMPTY_PRODUCT_FILTERS } from '@/components/ProductsFilter.vue'
import ModalForm from '@/components/ModalForm.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import { formatFilters } from '@/utils/utils'
import { ALL_FILTER_VALUE } from '@/consts/filters'

const LOCAL_STORAGE_KEY = 'products-list-view'

export default Vue.extend({
  components: {
    ProductTile,
    ProductListItem,
    ProductsFilter,
    ModalForm,
    PaginatedList,
  },
  data: () => ({
    filters: { ...EMPTY_PRODUCT_FILTERS },
    areFiltersOpen: false,
    listView: false,
  }),
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
  watch: {
    listView(listView: boolean) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, String(Number(listView)))
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.category = (this.$route.query.category as string) || ALL_FILTER_VALUE
    this.filters.brand = (this.$route.query.brand as string) || ALL_FILTER_VALUE

    this.listView = !!+(window.localStorage.getItem(LOCAL_STORAGE_KEY) || 0)
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
    }

    .paginated-list__list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 22px;
      padding: 0;
      min-height: 100px;
      margin-bottom: 12px;
      align-items: start;
    }

    @media (min-width: 700px) {
      .paginated-list__list {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    @media (min-width: $break) {
      .paginated-list__list {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
    }
  }
}
</style>
