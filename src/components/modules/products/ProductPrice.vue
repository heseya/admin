<template>
  <div class="product-price">
    <component :is="tag" class="product-price__price">
      {{ formatCurrency(priceMin) }}
      <template v-if="priceMin !== priceMax"> - {{ formatCurrency(priceMax) }} </template>
    </component>

    <component
      :is="tag"
      v-if="isDiscounted"
      class="product-price__price product-price__price--discounted"
    >
      {{ formatCurrency(priceMinInitial) }}
      <template v-if="priceMinInitial !== priceMaxInitial">
        - {{ formatCurrency(priceMaxInitial) }}
      </template>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product, parsePrices } from '@heseya/store-core'

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

    priceMin(): number {
      return parsePrices(this.product.prices_min, this.currency)
    },
    priceMax(): number {
      return parsePrices(this.product.prices_max, this.currency)
    },
    priceMinInitial(): number {
      return parsePrices(this.product.prices_min_initial, this.currency)
    },
    priceMaxInitial(): number {
      return parsePrices(this.product.prices_max_initial, this.currency)
    },

    isDiscounted(): boolean {
      return this.priceMax < this.priceMaxInitial || this.priceMin < this.priceMinInitial
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
