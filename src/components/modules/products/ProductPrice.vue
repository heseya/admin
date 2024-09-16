<template>
  <div class="product-price">
    <component :is="tag" class="product-price__price">
      {{ formatCurrency(price) }}
    </component>

    <component
      :is="tag"
      v-if="isDiscounted"
      class="product-price__price product-price__price--discounted"
    >
      {{ formatCurrency(priceInitial) }}
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@heseya/store-core'

import { formatCurrency } from '@/utils/currency'
import { ProductList } from '@heseya/store-core'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product | ProductList>,
      required: true,
    },
    tag: {
      type: String,
      default: 'span',
    },
  },
  computed: {
    currency(): string {
      return this.$accessor.config.currency
    },

    price(): number {
      return parseFloat(this.product?.price?.net ?? 0)
    },

    priceInitial(): number {
      return parseFloat(this.product?.price_initial?.net ?? 0)
    },

    isDiscounted(): boolean {
      return this.price < this.priceInitial
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.currency)
    },
  },
})
</script>

<style lang="scss" scoped>
.product-price {
  &__price {
    &--discounted {
      font-size: 75%;
      position: relative;
      top: -0.5em;
      margin-left: 4px;
      color: var(--red-color-400);
      text-decoration: line-through;
    }
  }
}
</style>
