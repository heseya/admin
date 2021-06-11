<template>
  <div class="products-container">
    <PaginatedList title="Asortyment" :filters="filters" storeKey="products">
      <template #nav>
        <vs-button color="dark" @click="areFiltersOpen = true" icon>
          <i class="bx bx-filter-alt"></i>
        </vs-button>

        <vs-button to="/products/create" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item }">
        <Product :product="item"></Product>
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

<script>
import Product from '@/components/Product.vue'
import ProductsFilter, { EMPTY_PRODUCT_FILTERS } from '@/components/ProductsFilter.vue'
import ModalForm from '@/components/ModalForm.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import { formatFilters } from '@/utils/utils'
import { ALL_FILTER_VALUE } from '@/consts/filters'

export default {
  components: {
    Product,
    ProductsFilter,
    ModalForm,
    PaginatedList,
  },
  data: () => ({
    filters: { ...EMPTY_PRODUCT_FILTERS },
    areFiltersOpen: false,
  }),
  methods: {
    changePage(page) {
      if (this.page !== page) {
        this.$router.push({ path: 'products', query: { ...this.$route.query, page } })
      }
    },
    makeSearch(filters) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'products',
        query: { page: undefined, ...queryFilters },
      })
    },
  },
  created() {
    this.filters.search = this.$route.query.search || ''
    this.filters.category = this.$route.query.category || ALL_FILTER_VALUE
    this.filters.brand = this.$route.query.brand || ALL_FILTER_VALUE
  },
}
</script>

<style lang="scss">
.products-container {
  .card {
    padding: 0;
    background-color: #fff0;
    box-shadow: none;
  }

  .paginated-items__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 22px;
    padding: 0;
    min-height: 100px;
    margin-bottom: 12px;
    align-items: start;
  }

  @media (min-width: 700px) {
    .paginated-items__list {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  @media (min-width: $break) {
    .paginated-items__list {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }
}
</style>
