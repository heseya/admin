<template>
  <div class="order-discount-summary">
    <div v-for="type in discountTypes" :key="type" class="order-discount-summary__section">
      <span class="order-discount-summary__title">
        {{ $t(`targetTypeTitle.${type}`) }}
      </span>

      <div
        v-for="discount in groupedDiscounts[type]"
        :key="discount.id"
        class="order-discount-summary__row"
      >
        <b>{{ discount.code || discount.name }}</b>
        <span>{{ formatCurrency(-discount.applied_discount) }}</span>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "targetTypeTitle": {
      "order-value": "Order value discounts",
      "products": "Product discounts",
      "shipping-price": "Shipping price discounts",
      "cheapest-product": "Cheapest product in cart discounts"
    }
  },
  "pl": {
    "targetTypeTitle": {
      "order-value": "Promocje na zamówienie",
      "products": "Promocje uwzględnione w produktach",
      "shipping-price": "Promocje na dostawę",
      "cheapest-product": "Promocje na najtańszy produkt"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import groupBy from 'lodash/groupBy'
import { DiscountTargetType, OrderDiscount } from '@heseya/store-core'

import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  props: {
    discounts: {
      type: Array,
      required: true,
    } as Vue.PropOptions<OrderDiscount[]>,
  },
  computed: {
    groupedDiscounts(): Record<DiscountTargetType, OrderDiscount[]> {
      return groupBy(this.discounts, 'target_type') as unknown as Record<
        DiscountTargetType,
        OrderDiscount[]
      >
    },
    discountTypes(): DiscountTargetType[] {
      return Object.keys(this.groupedDiscounts) as DiscountTargetType[]
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
.order-discount-summary {
  &__section:not(:last-child) {
    margin-bottom: 8px;
  }

  &__title {
    color: $gray-color-500;
    font-weight: 600;
    font-size: 0.8em;
  }

  &__row {
    display: flex;
    justify-content: space-between;

    @media ($viewport-4) {
      min-width: 240px;
    }

    b {
      margin-right: 8px;
    }
  }
}
</style>
