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
        <a-tooltip v-bind="item.product.sets.length === 0 ? { visible: false } : {}">
          <template #title>
            <small>{{ $t('productSets') }}:</small>
            <div v-for="set in item.product.sets" :key="set.id">{{ set.name }}</div>
          </template>
          <i v-if="item.product.sets.length" class="bx bxs-info-circle"></i>
        </a-tooltip>

        {{ item.product.name }}&nbsp;
        <small v-if="item.quantity !== 1">(x{{ item.quantity }})</small>
      </span>
      <small v-for="schema in item.schemas" :key="schema.id">
        <span>{{ schema.name }}:</span> {{ schema.value }}
        <small v-if="schema.price !== 0">(+ {{ formatCurrency(schema.price) }} )</small>
      </small>
    </div>
    <span v-if="discount" class="cart-item__price">
      <a-tooltip>
        <template #title>
          {{ $t('priceTooltip') }}
        </template>
        <i class="bx bxs-error"></i> {{ formatCurrency(discountedPrice) }}
      </a-tooltip>
      <small v-if="discount">{{ $t('beforeDiscount') }}: {{ formatCurrency(item.price) }} </small>
    </span>
    <span v-else class="cart-item__price">
      {{ formatCurrency(item.price) }}
    </span>
  </div>
</template>

<i18n>
{
  "en": {
    "productSets": "Kolekcje produktu",
    "priceTooltip": "Kwota po rabacie może być błędna, sprawdź czy nie brakuje części groszowej zanim zaczniesz wystawiać dokumenty księgowe.",
    "beforeDiscount": "Przed rabatem"
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
  }

  &__title {
    display: block;
    padding: 12px 0;

    i {
      color: $primary-color-300;
    }

    span {
      color: #333333;
    }

    small {
      color: #cccccc;
    }
  }

  &__price {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-left: auto;
    font-weight: 600;
    white-space: nowrap;
    flex-direction: column;

    small {
      font-weight: 400;
    }

    .bx {
      color: $red-color-500;
    }
  }
}
</style>
