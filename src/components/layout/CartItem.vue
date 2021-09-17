<template>
  <div class="cart-item">
    <img
      v-if="coverUrl"
      class="cart-item__cover"
      :src="`${coverUrl}?w=60&h=60`"
      :style="{ objectFit }"
    />
    <div v-else class="cart-item__cover" />
    <div class="cart-item__content">
      <span>
        {{ item.product.brand && item.product.brand.name }} {{ item.product.name }}&nbsp;
        <small v-if="item.quantity !== 1">(x{{ item.quantity }})</small>
      </span>
      <small v-for="schema in item.schemas" :key="schema.id">
        <span>{{ schema.name }}:</span> {{ schema.value }}
        <small v-if="schema.price !== 0">(+ {{ formatCurrency(schema.price) }} )</small>
      </small>
    </div>
    <span class="cart-item__price">{{ formatCurrency(item.price) }} </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { CartItem } from '@/interfaces/CartItem'
import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  props: {
    item: {
      type: Object,
      required: true,
    } as Vue.PropOptions<CartItem>,
  },
  computed: {
    coverUrl(): string {
      return this.item?.product?.cover?.url
    },
    objectFit(): string {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
  },
})
</script>

<style lang="scss">
.cart-item {
  margin: 8px 0;
  padding: 12px;
  border-radius: 12px;
  transition: 0.3s;
  display: flex;

  &__cover {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 12px;
    background-color: #eeeeee;
    text-indent: -10000px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 12px;

    small {
      color: #aaaaaa;

      span {
        color: #333333;
      }

      small {
        color: #cccccc;
      }
    }
  }

  &__price {
    display: flex;
    justify-content: center;
    margin-left: auto;
    font-weight: 600;
    white-space: nowrap;
  }
}
</style>
