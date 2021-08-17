<template>
  <vs-dialog width="900px" class="set-products" not-center :value="isOpen" @input="$emit('close')">
    <template #header>
      <div class="set-products__header">
        <h4>Produkty w kolekcji {{ set && set.name }}</h4>
        <vs-button v-can="$p.ProductSets.Edit" dark @click="isSelectorActive = true">
          <i class="bx bx-plus"></i> &nbsp; Dodaj produkt do kolekcji
        </vs-button>
      </div>
    </template>

    <div v-if="products.length" class="set-products__list">
      <div class="set-product-item" v-for="product in products" :key="product.id">
        <vs-avatar color="#eee">
          <img
            v-if="product.cover"
            :src="`${product.cover.url}?w=100&h=100`"
            :style="{ objectFit }"
          />
          <i v-else class="product-list-item__img-icon bx bx-image"></i>
        </vs-avatar>
        <div class="set-product-item__main">
          <span class="set-product-item__name">{{ product.name }}</span>
          <span class="set-product-item__price">{{ product.price }} {{ currency }}</span>
        </div>
        <div class="set-product-item__actions">
          <vs-button
            v-can="$p.ProductSets.Edit"
            danger
            icon
            size="small"
            @click.stop="removeProduct(product.id)"
          >
            <i class="bx bx-trash"></i>
          </vs-button>
        </div>
      </div>
    </div>

    <empty v-else>Ta kolekcja nie zawiera produktów</empty>

    <vs-button success @click="save">Zapisz</vs-button>

    <vs-dialog width="800px" not-center v-model="isSelectorActive">
      <template #header>
        <h4>Wybierz produkt</h4>
      </template>
      <selector typeName="produkt" type="products" :existing="products" @select="addProduct" />
    </vs-dialog>
  </vs-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

import Selector from '@/components/Selector.vue'
import Empty from '@/components/layout/Empty.vue'

import { ProductSet } from '@/interfaces/ProductSet'
import { Product } from '@/interfaces/Product'
import { UUID } from '@/interfaces/UUID'
import { api } from '@/api'
import { formatApiError } from '@/utils/errors'

export default Vue.extend({
  components: { Selector, Empty },
  props: {
    set: {
      type: Object,
      default: null,
    } as Vue.PropOptions<ProductSet | null>,
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currency(): string {
      return this.$accessor.currency
    },
    objectFit(): string {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
  data: () => ({
    isSelectorActive: false,
    products: [] as Product[],
  }),
  watch: {
    set(v: ProductSet | null) {
      if (v) this.fetchProducts()
    },
  },
  methods: {
    addProduct(product: Product) {
      this.products.push(product)
    },
    removeProduct(productId: UUID) {
      this.products = this.products.filter((product) => product.id !== productId)
    },

    async fetchProducts() {
      if (!this.set) return
      this.$accessor.startLoading()
      try {
        const {
          data: { data: products },
        } = await api.get<{ data: Product[] }>(`/product-sets/id:${this.set.id}/products`)
        this.products = products
      } catch (e) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(e),
        })
      }
      this.$accessor.stopLoading()
    },

    async save() {
      if (!this.set) return
      this.$accessor.startLoading()
      try {
        const products = this.products.map((p) => p.id)
        await api.post(`/product-sets/id:${this.set.id}/products`, { products })
        this.$vs.notification({
          color: 'success',
          title: 'Produkty zostały zapisane w kolekcji',
        })
        this.$emit('close')
      } catch (e) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(e),
        })
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.set-products {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__list {
    overflow: auto;
    max-height: 50vh;
    margin-bottom: 24px;
  }
}

.set-product-item {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  transition: 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }

  &__main {
    margin-left: 8px;
  }

  &__name {
    display: block;
    font-family: $font-sec;
  }

  &__price {
    display: block;
    font-size: 0.8em;
  }

  &__actions {
    margin-left: auto;
  }
}
</style>
