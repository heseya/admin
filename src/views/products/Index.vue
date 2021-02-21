<template>
  <div>
    <top-nav title="Asortyment">
      <vs-button to="/items" color="dark" icon>
        <i class="bx bxs-package"></i>
      </vs-button>

      <vs-button color="dark" @click="areFiltersOpen = true" icon>
        <i class="bx bx-filter-alt"></i>
      </vs-button>

      <vs-button to="/products/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <app-empty v-if="!products.length">Nie ma żadnego produktu</app-empty>
    <div class="products-list">
      <product v-for="product in products" :key="product.id" :product="product"></product>
    </div>
    <pagination v-if="meta.last_page" :value="page" @input="changePage" :length="meta.last_page" />

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
import TopNav from '@/layout/TopNav.vue'
import Product from '@/components/Product.vue'
import Empty from '@/components/Empty.vue'
import Pagination from '../../components/Pagination.vue'
import ProductsFilter from '../../components/ProductsFilter.vue'
import ModalForm from '../../components/ModalForm.vue'

export default {
  components: {
    TopNav,
    Product,
    appEmpty: Empty,
    Pagination,
    ProductsFilter,
    ModalForm,
  },
  data: () => ({
    page: 1,
    filters: {
      search: '',
      category: 0,
      brand: 0,
    },
    areFiltersOpen: false,
  }),
  computed: {
    products() {
      return this.$store.getters['products/getData']
    },
    meta() {
      return this.$store.getters['products/getMeta']
    },
  },
  watch: {
    '$route.query'({ page }) {
      this.page = page || 1
      if (this.meta.current_page !== page) {
        this.getProducts()
        window.scrollTo(0, 0)
      }
    },
  },
  methods: {
    changePage(page) {
      if (this.page !== page) {
        this.$router.push({ path: 'products', query: { page, search: this.$route.query.search } })
      }
    },
    makeSearch(filters) {
      this.filters = filters

      this.$router.push({
        path: 'products',
        query: { page: undefined, ...this.filters },
      })
    },
    async getProducts() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('products/fetch', {
        page: this.page,
        ...this.filters,
      })
      loading.close()
    },
  },
  created() {
    this.page = this.$route.query.page || 1
    this.filters.search = this.$route.query.search || ''
    this.filters.category = this.$route.query.category || ''
    this.filters.brand = this.$route.query.brand || ''
    this.getProducts()
  },
}
</script>

<style lang="scss">
.products-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 22px;
  min-height: 100px;
  margin-bottom: 12px;
}

@media (min-width: $break) {
  .products-list {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>
