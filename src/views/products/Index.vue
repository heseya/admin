<template>
  <div>
    <top-nav title="Asortyment">
      <!-- <vs-button to="/items" color="dark" icon>
        <i class="bx bxs-package"></i>
      </vs-button> -->
      <vs-input
        state="dark"
        type="search"
        v-model="search"
        @keydown.enter="makeSearch"
        placeholder="Wyszukiwanie"
      />

      <vs-button @click="makeSearch" color="dark" icon>
        <i class="bx bx-search"></i>
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
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Product from '@/components/Product.vue'
import Empty from '@/components/Empty.vue'
import Pagination from '../../components/Pagination.vue'

export default {
  components: {
    TopNav,
    Product,
    appEmpty: Empty,
    Pagination,
  },
  data: () => ({
    page: 1,
    search: '',
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
    makeSearch() {
      if (this.search !== this.$route.query.search) {
        this.$router.push({
          path: 'products',
          query: { page: undefined, search: this.search || undefined },
        })
      }
    },
    async getProducts() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('products/fetch', {
        page: this.page,
        search: this.$route.query.search,
      })
      loading.close()
    },
  },
  created() {
    this.page = this.$route.query.page || 1
    this.search = this.$route.query.search || ''
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
