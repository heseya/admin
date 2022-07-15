<template>
  <div class="cart-item">
    <div class="cart-item__product">
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
    </div>

    <field :label="$t('header.perItem')">
      <span class="cart-item__value">
        {{ formatCurrency(item.price_initial) }}
      </span>
    </field>

    <field :label="$t('header.discounted')">
      <span class="cart-item__value">
        {{ formatCurrency(item.price) }}

        <info-tooltip v-if="item.discounts.length">
          <OrderDiscountSummary :discounts="item.discounts" />
        </info-tooltip>
      </span>
    </field>

    <field :label="$t('header.quantity')">
      <span class="cart-item__value">
        {{ item.quantity }}
      </span>
    </field>

    <field :label="$t('header.total')">
      <span class="cart-item__value">
        {{ formatCurrency(totalPrice) }}
      </span>
    </field>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "header": {
      "title": "Produkty w koszyku",
      "perItem": "Cena szt.",
      "discounted": "Po rabacie",
      "quantity": "Ilość",
      "total": "Wartość"
    },
    "productSets": "Kolekcje produktu",
    "priceTooltip": "Kwota po rabacie może być błędna, sprawdź czy nie brakuje części groszowej zanim zaczniesz wystawiać dokumenty księgowe.",
    "beforeDiscount": "Przed rabatem"
  },
  "en": {
    "header": {
      "title": "Products in cart",
      "perItem": "Price per item",
      "discounted": "After discount",
      "quantity": "Quantity",
      "total": "Total"
    },
    "productSets": "Product sets",
    "priceTooltip": "The price may be incorrect, check if there is a penny left before you start issuing invoices.",
    "beforeDiscount": "Before discount"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { OrderProduct } from '@heseya/store-core'

import { formatCurrency } from '@/utils/currency'
import Field from '../Field.vue'
import InfoTooltip from './InfoTooltip.vue'
import OrderDiscountSummary from '../modules/orders/OrderDiscountSummary.vue'

export default Vue.extend({
  components: { Field, InfoTooltip, OrderDiscountSummary },
  props: {
    item: {
      type: Object,
      required: true,
    } as Vue.PropOptions<OrderProduct>,
  },
  computed: {
    coverUrl(): string {
      return this.item?.product?.cover?.url || ''
    },
    objectFit(): string {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
    totalPrice(): number {
      return this.item.price * this.item.quantity
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
  grid-template-columns: 1fr 1fr;

  @media ($viewport-4) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media ($viewport-8) {
    grid-template-columns: 4fr 1fr 1.2fr 0.5fr 1fr;
  }

  &__product {
    width: 100%;
    display: flex;
    align-items: flex-start;
    grid-column: 1/-1;

    @media ($max-viewport-8) {
      margin-bottom: 8px;
    }

    @media ($viewport-8) {
      grid-column: 1/2;
    }
  }

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
    width: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-align: center;

    small {
      font-weight: 400;
    }

    .info-tooltip__icon {
      margin-left: 4px;
      font-size: 0.8em;
      color: $primary-color-500;
    }
  }

  .order-field {
    padding: 3px;

    @media ($viewport-8) {
      justify-content: center;

      &:last-of-type {
        justify-content: end;
      }
    }
  }

  .order-field__label {
    display: block;
    width: 100%;
  }

  @media ($viewport-8) {
    .order-field__label {
      display: none;
    }

    .order-field:last-of-type &__value {
      justify-content: flex-end;
      align-items: flex-end;
      text-align: right;
    }
  }
}
</style>
