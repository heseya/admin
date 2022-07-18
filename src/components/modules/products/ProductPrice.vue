<template>
  <div class="product-price">
    <component :is="tag" class="product-price__price">
      {{ formatCurrency(product.price_min) }}
      <template v-if="product.price_min !== product.price_max">
        - {{ formatCurrency(product.price_max) }}
      </template>
    </component>

    <component
      :is="tag"
      v-if="isDiscounted"
      class="product-price__price product-price__price--discounted"
    >
      {{ formatCurrency(product.price_min_initial) }}
      <template v-if="product.price_min_initial !== product.price_max_initial">
        - {{ formatCurrency(product.price_max_initial) }}
      </template>
    </component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@heseya/store-core'

import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  props: {
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Product>,
    tag: {
      type: String,
      default: 'span',
    },
  },
  computed: {
    isDiscounted(): boolean {
      return (
        this.product.price_max < this.product.price_max_initial ||
        this.product.price_min < this.product.price_min_initial
      )
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
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
      color: $red-color-400;
      text-decoration: line-through;
    }
  }
}
</style>
