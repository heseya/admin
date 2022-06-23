<template>
  <div class="order-cart">
    <span class="order-cart__header-title order-title">{{ $t('header.title') }}</span>
    <div class="order-cart__header">
      <span class="order-title">{{ $t('header.title') }}</span>
      <span class="order-title">{{ $t('header.perItem') }}</span>
      <span class="order-title">{{ $t('header.discounted') }}</span>
      <span class="order-title">{{ $t('header.quantity') }}</span>
      <span class="order-title">{{ $t('header.total') }}</span>
    </div>
    <CartItem v-for="item in order.products" :key="item.id" :item="item" />
    <hr />
    <div class="order-cart__summary">
      <field :label="$t('summary.cart')" horizontal>
        {{ formatCurrency(order.cart_total_initial) }}
      </field>
      <field :label="$t('summary.shipping')" horizontal>
        {{ formatCurrency(order.shipping_price_initial) }}
      </field>
      <field
        v-if="order.discounts && order.discounts.length"
        :label="$t('summary.coupons')"
        horizontal
      >
        <div class="discount-summary">
          <span class="discount-summary__total">
            {{ formatCurrency(-totalDiscount) }}
          </span>
          <info-tooltip>
            <OrderDiscountSummary :discounts="order.discounts" />
          </info-tooltip>
        </div>
      </field>
      <field class="order-cart__summary-total" :label="$t('summary.total')" horizontal>
        {{ formatCurrency(order.summary) }}
      </field>
      <boolean-tag
        :value="order.paid"
        :true-text="$t('orderPaid')"
        :false-text="$t('orderNotPaid')"
      />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "header": {
      "title": "Products in cart",
      "perItem": "Price per item",
      "discounted": "After discount",
      "quantity": "Quantity",
      "total": "Total"
    },
    "orderPaid": "Paid",
    "orderNotPaid": "Not paid",
    "summary": {
      "cart": "Cart total",
      "shipping": "Shipping price",
      "coupons": "Coupons",
      "total": "Total"
    }
  },
  "pl": {
    "header": {
      "title": "Produkty w koszyku",
      "perItem": "Cena szt.",
      "discounted": "Po rabacie",
      "quantity": "Ilość",
      "total": "Wartość"
    },
    "orderPaid": "Opłacono",
    "orderNotPaid": "Nie opłacono",
    "summary": {
      "cart": "Wartość koszyka",
      "shipping": "Koszt przesyłki",
      "coupons": "Rabaty",
      "total": "Do zapłaty"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import CartItem from '@/components/layout/CartItem.vue'
import Field from '../../Field.vue'
import OrderDiscountSummary from './OrderDiscountSummary.vue'

import { Order } from '@/interfaces/Order'
import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  components: { CartItem, Field, OrderDiscountSummary },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  computed: {
    totalDiscount(): number {
      return this.order.discounts
        .map((d) => d.applied_discount)
        .reduce((sum, discount) => sum + discount, 0)
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
.order-cart {
  &__summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    ::v-deep .order-field {
      font-size: 1em;
    }
  }

  &__summary-total {
    margin-top: 16px;
  }

  &__summary-total ::v-deep .order-field__value {
    font-size: 1.4em;
    font-weight: 600;
  }

  &__header-title {
    margin-left: 12px;

    @media ($viewport-8) {
      display: none;
    }
  }

  &__header {
    display: none;
    align-items: flex-start;
    grid-template-columns: 4fr 1fr 1.2fr 0.5fr 1fr;
    text-align: center;
    padding: 0 12px;

    @media ($viewport-8) {
      font-size: 0.8em;
      display: grid;
    }

    @media ($viewport-14) {
      font-size: 1em;
    }

    > * {
      padding: 4px;
    }

    > :first-child {
      text-align: left;
    }

    > :last-child {
      text-align: right;
    }
  }
}

.discount-summary {
  &__total {
    margin-right: 5px;
  }

  &__item {
    display: flex;
  }

  .bx {
    color: $primary-color-500;
    font-size: 0.8em;
  }
}
</style>
