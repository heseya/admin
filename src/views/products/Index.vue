<template>
  <div>
    <top-nav title="Asortyment">

      <vs-button to="/items" color="dark" icon>
        <i class="bx bxs-package"></i>
      </vs-button>

      <vs-button to="/products/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button>

    </top-nav>

    <div class="products-list">
      <product v-for="product in products" :key="product.id" :product="product"></product>
    </div>
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
  computed: {
    products () {
      return this.$store.state.products.data
    }
  },
  methods: {
    async getProducts () {
      const loading = this.$vs.loading({ color: '#000' })

      try {
        await this.$store.dispatch('products/fetch')
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    }
  },
  created () {
    this.getProducts()
  }
}
</script>

<style lang="scss">
.products-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 22px;
  min-height: 100px;
}

@media (min-width: $break) {
  .products-list {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>
