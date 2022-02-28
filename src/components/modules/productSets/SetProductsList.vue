<template>
  <a-modal width="900px" class="set-products" :visible="isOpen" @cancel="$emit('close')">
    <template #title>
      <div class="set-products__header">
        <h4>{{ $t('title') }} {{ set && set.name }}</h4>
        <icon-button v-can="$p.ProductSets.Edit" size="small" dark @click="isSelectorActive = true">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('addProduct') }}
        </icon-button>
      </div>
    </template>

    <div v-if="products.length" class="set-products__list">
      <div v-for="product in products" :key="product.id" class="set-product-item">
        <avatar color="#eee">
          <img
            v-if="product.cover"
            :src="`${product.cover.url}?w=100&h=100`"
            :style="{ objectFit }"
          />
          <i v-else class="product-list-item__img-icon bx bx-image"></i>
        </avatar>
        <div class="set-product-item__main">
          <span class="set-product-item__name">{{ product.name }}</span>
          <span class="set-product-item__price">{{ formatCurrency(product.price) }}</span>
        </div>
        <div class="set-product-item__actions">
          <icon-button
            v-can="$p.ProductSets.Edit"
            size="small"
            type="danger"
            @click.stop="removeProduct(product.id)"
          >
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
          </icon-button>
        </div>
      </div>
    </div>

    <empty v-else>{{ $t('empty') }}</empty>

    <template #footer>
      <app-button type="success" @click="save">{{ $t('common.save') }}</app-button>
    </template>

    <a-modal v-model="isSelectorActive" width="800px" :title="$t('chooseProduct')" :footer="null">
      <selector
        :type-name="$t('product')"
        type="products"
        :existing="products"
        @select="addProduct"
      />
    </a-modal>
  </a-modal>
</template>

<i18n>
{
  "pl": {
    "title": "Produkty w kolekcji",
    "addProduct": "Dodaj produkt do kolekcji",
    "empty": "Ta kolekcja nie zawiera produktów",
    "chooseProduct": "Wybierz produkt",
    "successMessage": "Produkty zostały zapisane w kolekcji",
    "product": "produkt"
  },
  "en": {
    "title": "Products in collection",
    "addProduct": "Add product to collection",
    "empty": "This collection does not contain products",
    "chooseProduct": "Choose product",
    "successMessage": "Products saved in collection",
    "product": "product"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import Selector from '@/components/Selector.vue'
import Empty from '@/components/layout/Empty.vue'
import Avatar from '@/components/layout/Avatar.vue'

import { ProductSet } from '@/interfaces/ProductSet'
import { Product } from '@/interfaces/Product'
import { UUID } from '@/interfaces/UUID'

import { api } from '@/api'
import { formatCurrency } from '@/utils/currency'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { Selector, Empty, Avatar },
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
  data: () => ({
    isSelectorActive: false,
    products: [] as Product[],
  }),
  computed: {
    objectFit(): string {
      return +this.$accessor.config.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
  watch: {
    set(v: ProductSet | null) {
      if (v) this.fetchProducts()
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
    },
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
        } = await api.get<{ data: Product[] }>(`/product-sets/id:${this.set.id}/products?limit=500`)
        this.products = products
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
    },

    async save() {
      if (!this.set) return
      this.$accessor.startLoading()
      try {
        const products = this.products.map((p) => p.id)
        await api.post(`/product-sets/id:${this.set.id}/products`, { products })
        this.$toast.success(this.$t('successMessage') as string)
        this.$emit('close')
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
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
    padding-right: 24px;

    h4 {
      margin-bottom: 0;
    }
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
    font-weight: 600;
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
