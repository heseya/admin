<template>
  <div>
    <top-nav title="Asortyment">

      <vs-button to="/items" color="dark" icon>
        <i class='bx bxs-package'></i>
      </vs-button>

      <vs-button to="/products/create" color="dark" icon>
        <i class='bx bx-plus'></i>
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
  data () {
    return {
      products: [
        { id: 1, name: 'Ankh', price: '200 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?1' },
        { id: 2, name: 'Doberman', price: '190 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?2' },
        { id: 3, name: 'Tribal', price: '150 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?3' },
        { id: 4, name: 'Tribal', price: '150 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?4' },
        { id: 5, name: 'Tribal', price: '150 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?5' },
        { id: 6, name: 'Tribal', price: '150 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?6' },
        { id: 7, name: 'Tribal', price: '150 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?7' },
        { id: 8, name: 'Tribal', price: '150 zł', img: 'https://source.unsplash.com/collection/5042880/400x400?8' }
      ]
    }
  },
  components: {
    TopNav,
    Product
  }
}
</script>

<style lang="scss">
.products-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 22px;
  margin: 40px 0;
}

@media (min-width: $break) {
  .products-list {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>
