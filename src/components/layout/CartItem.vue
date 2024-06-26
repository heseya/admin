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
          <router-link :to="`/products/${item.product.id}`" class="cart-item__name">
            {{ item.name }}
          </router-link>

          <info-tooltip
            v-if="item.product.sets.length"
            v-bind="item.product.sets.length === 0 ? { visible: false } : {}"
          >
            <small>{{ $t('productSets') }}:</small>
            <div v-for="set in item.product.sets" :key="set.id">{{ set.name }}</div>
          </info-tooltip>
        </span>

        <div class="cart-item__schema-list">
          <div
            v-if="highlightedAttributeSlug && highlightedAttributeValue"
            class="cart-item__schema"
          >
            <span class="cart-item__schema-name">
              {{ highlightedAttributeSlug.toUpperCase() }}:
            </span>
            <span class="cart-item__schema-value"> {{ highlightedAttributeValue }} </span>
          </div>

          <div v-for="schema in item.schemas" :key="schema.id" class="cart-item__schema">
            <span class="cart-item__schema-name">{{ schema.name }}:</span>
            <span class="cart-item__schema-value">
              {{ schema.value }}
              <small v-if="parseFloat(schema.price.gross) !== 0"
                >(+ {{ formatCurrency(schema.price.gross) }} )</small
              >
            </span>
          </div>
        </div>

        <div class="cart-item__row">
          <tag v-if="item.shipping_digital" type="primary" small>{{ $t('shippingDigital') }}</tag>

          <icon-button
            v-if="item.urls.length || item.shipping_digital"
            size="small"
            reversed
            @click="showProductUrls"
          >
            <template #icon><i class="bx bx-link"></i></template>
            {{ $t('showProductUrls') }}
          </icon-button>
        </div>
      </div>
    </div>

    <field :label="$t('header.perItem').toString()">
      <span class="cart-item__value">
        {{ formatCurrency(item.price_initial) }}
      </span>
    </field>

    <field :label="$t('header.discounted').toString()">
      <span class="cart-item__value">
        {{ formatCurrency(item.price) }}

        <info-tooltip v-if="item.discounts && item.discounts.length">
          <OrderDiscountSummary :discounts="item.discounts" :currency="currency" />
        </info-tooltip>
      </span>
    </field>

    <field :label="$t('header.quantity').toString()">
      <span class="cart-item__value">
        {{ item.quantity }}
      </span>
    </field>

    <field :label="$t('header.total').toString()">
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
    "beforeDiscount": "Przed rabatem",
    "shippingDigital": "Product z wysyłką cyfrową",
    "showProductUrls": "Pokaż linki"
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
    "beforeDiscount": "Before discount",
    "shippingDigital": "Product with digital shipping",
    "showProductUrls": "Show links"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { OrderProduct } from '@heseya/store-core'

import { formatCurrency } from '@/utils/currency'
import Field from '../Field.vue'
import InfoTooltip from './InfoTooltip.vue'
import OrderDiscountSummary from '../modules/orders/OrderDiscountSummary.vue'
import IconButton from './IconButton.vue'

import { FEATURE_FLAGS, SETTINGS_KEYS } from '@/consts/featureFlags'

export default defineComponent({
  components: {
    Field,
    InfoTooltip,
    OrderDiscountSummary,
    IconButton,
  },
  props: {
    item: {
      type: Object as PropType<OrderProduct>,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  computed: {
    coverUrl(): string {
      return this.item?.product?.cover?.url || ''
    },
    objectFit(): 'contain' | 'cover' {
      return +this.$accessor.config.env[FEATURE_FLAGS.ProductContain] ? 'contain' : 'cover'
    },
    totalPrice(): number {
      return parseFloat(this.item.price) * this.item.quantity
    },
    highlightedAttributeSlug(): string {
      return this.$accessor.config.env[SETTINGS_KEYS.HighlightedProductAttribute]
    },
    highlightedAttributeValue(): string {
      // TODO: this fails, cause item.product does not have attributes on this resource
      return (
        this.item.product.attributes?.find(
          (attribute) => attribute.slug === this.highlightedAttributeSlug,
        )?.selected_options[0]?.name || this.$i18n.t('common.none').toString()
      )
    },
  },
  methods: {
    formatCurrency(amount: number | string) {
      return formatCurrency(amount, this.currency)
    },
    showProductUrls() {
      this.$emit('show-urls')
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
    background-color: var(--gray-color-300);
    text-indent: -10000px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    margin-left: 12px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  &__title {
    display: block;
    // margin-bottom: 8px;

    .info-tooltip__icon {
      color: var(--blue-color-400);
    }
  }

  &__name {
    font-weight: 500;
    font-size: 1.1em;
    color: var(--font-color);
    transition: 0.3s;

    &:hover {
      color: var(--primary-color-300);
    }
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
    color: var(--gray-color-500);
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
      color: var(--primary-color-500);
    }
  }

  .field {
    padding: 3px;

    @media ($viewport-8) {
      justify-content: center;

      &:last-of-type {
        justify-content: end;
      }
    }
  }

  .field__label {
    display: block;
    width: 100%;
  }

  @media ($viewport-8) {
    .field__label {
      display: none;
    }

    .field:last-of-type &__value {
      justify-content: flex-end;
      align-items: flex-end;
      text-align: right;
    }
  }
}
</style>
