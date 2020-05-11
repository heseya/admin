<template>
  <div>
    <top-nav title="Asortyment">
      <!-- <vs-button to="/items" color="dark" icon>
        <i class="bx bxs-package"></i>
      </vs-button> -->

      <vs-button to="/products/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>
    </top-nav>

    <div class="products-list">
      <product v-for="product in products" :key="product.id" :product="product"></product>
    </div>
    <vs-pagination color="dark" v-if="meta.last_page" v-model="page" :length="meta.last_page" />
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Product from '@/components/Product.vue'

export default {
  components: {
    TopNav,
    Product
  },
  data: () => ({
    page: 1
  }),
  computed: {
    products() {
      return this.$store.getters['products/getData']
    },
    meta() {
      return this.$store.getters['products/getMeta']
    }
  },
  watch: {
    page(page) {
      if (this.meta.current_page !== page) this.getProducts(page)
      window.scrollTo(0, 0)
    }
  },
  methods: {
    async getProducts(page) {
      const loading = this.$vs.loading({ color: '#000' })
      this.page = page
      await this.$store.dispatch('products/fetch', { page })
      loading.close()
    }
  },
  created() {
    this.getProducts(1)
  }
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
