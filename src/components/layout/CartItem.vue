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
      <span class="cart-item__title">
        <span class="cart-item__name"> {{ item.product.name }} </span>

        <info-tooltip
          v-if="item.product.sets.length"
          v-bind="item.product.sets.length === 0 ? { visible: false } : {}"
        >
          <small>{{ $t('productSets') }}:</small>
          <div v-for="set in item.product.sets" :key="set.id">{{ set.name }}</div>
        </info-tooltip>
      </span>

      <div class="cart-item__schema-list">
        <div v-for="schema in item.schemas" :key="schema.id" class="cart-item__schema">
          <span class="cart-item__schema-name">{{ schema.name }}:</span>
          <span class="cart-item__schema-value">
            {{ schema.value }}
            <small v-if="schema.price !== 0">(+ {{ formatCurrency(schema.price) }} )</small>
          </span>
        </div>
      </div>
    </div>

    <span class="cart-item__value">
      {{ formatCurrency(item.price) }}
    </span>

    <span v-if="discount" class="cart-item__value">
      <info-tooltip icon="bx bxs-error">
        {{ $t('priceTooltip') }}
        <template #title>
          {{ formatCurrency(discountedPrice) }}
        </template>
      </info-tooltip>
    </span>
    <span v-else class="cart-item__value">
      {{ formatCurrency(item.price) }}
    </span>

    <span class="cart-item__value">
      {{ item.quantity }}
    </span>
    <span class="cart-item__value">
      {{ formatCurrency(totalPrice) }}
    </span>
  </div>
</template>

<i18n>
{
  "pl": {
    "productSets": "Kolekcje produktu",
    "priceTooltip": "Kwota po rabacie może być błędna, sprawdź czy nie brakuje części groszowej zanim zaczniesz wystawiać dokumenty księgowe.",
    "beforeDiscount": "Przed rabatem"
  },
  "en": {
    "productSets": "Product sets",
    "priceTooltip": "The price may be incorrect, check if there is a penny left before you start issuing invoices.",
    "beforeDiscount": "Before discount"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { CartItem } from '@/interfaces/CartItem'
import { formatCurrency } from '@/utils/currency'
import { DiscountCode, DiscountCodeType } from '@/interfaces/DiscountCode'

export default Vue.extend({
  props: {
    item: {
      type: Object,
      required: true,
    } as Vue.PropOptions<CartItem>,
    discount: {
      type: Object,
      default: () => null,
    } as Vue.PropOptions<DiscountCode>,
    productsCount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    coverUrl(): string {
      return this.item?.product?.cover?.url
    },
    objectFit(): string {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
    discountedPrice(): number {
      if (!this.discount) return this.item.price
      if (this.discount.type === DiscountCodeType.Percentage)
        return (this.item.price * (100 - this.discount.discount)) / 100

      // Amount
      return this.item.price - this.discount.discount / this.productsCount
    },
    totalPrice(): number {
      return this.discountedPrice * this.item.quantity
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
  display: grid;
  align-items: flex-start;
  grid-template-columns: 58px 4fr 1fr 1.2fr 0.5fr 1fr;

  &__cover {
    width: 58px;
    height: 58px;
    object-fit: cover;
    border-radius: 4px;
    background-color: #eeeeee;
    text-indent: -10000px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin-left: 12px;
  }

  &__title {
    display: block;
    // margin-bottom: 8px;

    .info-tooltip__icon {
      color: $blue-color-400;
    }
  }

  &__name {
    font-weight: 500;
    font-size: 1.1em;
  }

  &__schema-list {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }

  &__schema {
    margin-right: 14px;
  }

  &__schema-name {
    color: $gray-color-500;
  }

  &__value {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    flex-direction: column;

    &:last-of-type {
      justify-content: flex-end;
      align-items: flex-end;
      text-align: right;
    }

    small {
      font-weight: 400;
    }

    .info-tooltip__icon {
      color: $orange-color-500;
    }
  }
}
</style>
