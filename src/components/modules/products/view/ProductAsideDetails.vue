<template>
  <div class="product-aside-details">
    <div class="product-aside-details__row">
      <h2 class="product-page__subtitle">{{ $t('visibilityTitle') }}</h2>
      <product-visibility-switch v-model="form" :product="product" :disabled="disabled" />
    </div>
    <div class="product-aside-details__row">
      <h2 class="product-page__subtitle">
        {{ $t('availability.title') }}
        <info-tooltip :text="$t('availability.tooltip').toString()" />
      </h2>
      <boolean-tag
        :value="product.available"
        :true-text="$t('availability.available').toString()"
        :false-text="$t('availability.unavailable').toString()"
      />
    </div>
    <div class="product-aside-details__row">
      <h2 class="product-page__subtitle">
        {{ $t('priceTitle') }}
      </h2>
      <tag type="primary" class="product-aside-details__price">
        <product-price :product="product" />
      </tag>
    </div>
    <div class="product-aside-details__row">
      <h2 class="product-page__subtitle">
        {{ $t('promoTitle') }}
      </h2>
      <div v-if="sales.length" class="product-aside-details__sales">
        <a v-for="sale in sales" :key="sale.id" :href="`/sales/${sale.id}`" target="_blank">
          <tag type="primary" small>
            {{ sale.name }} (-{{
              sale.percentage !== null
                ? `${parseFloat(sale.percentage)}%`
                : formatPrice(sale.amounts)
            }})
          </tag>
        </a>
      </div>
      <tag v-else type="gray" small>{{ $t('common.none') }}</tag>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "visibilityTitle": "Widoczność produktu",
    "availability": {
      "title": "Dostępność produktu",
      "available": "Dostępny",
      "unavailable": "Niedostępny",
      "tooltip": "Dostępność produktu jest zależna od stanu przedmiotów na magazynie powiązanych z produktem oraz jego schematami. Jeśli produkt jest niedostępny, nie będzie możliwy do kupienia w sklepie."
    },
    "priceTitle": "Aktualna cena",
    "promoTitle": "Promocje"
  },
  "en": {
    "visibilityTitle": "Product visibility",
    "availability": {
      "title": "Product availability",
      "available": "Available",
      "unavailable": "Unavailable",
      "tooltip": "Product availability is dependent on the availability of items in warehouses associated with the product and its schemas. If the product is unavailable, it will not be available for purchase in the store."
    },
    "priceTitle": "Current price",
    "promoTitle": "Sales"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product, Price, parsePrices } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'
import ProductVisibilitySwitch from './ProductVisibilitySwitch.vue'
import ProductPrice from '../ProductPrice.vue'
import { formatCurrency } from '@/utils/currency'
import { ProductSale } from '@heseya/store-core'
import { sdk } from '@/api'

export default defineComponent({
  components: { ProductVisibilitySwitch, ProductPrice },
  props: {
    product: { type: Object as PropType<Product>, required: true },
    disabled: { type: Boolean, default: false },
    value: {
      type: Object as PropType<ProductComponentForm>,
      required: true,
    },
  },

  data: () => ({
    sales: [] as ProductSale[],
  }),

  computed: {
    form: {
      get(): ProductComponentForm {
        return this.value
      },
      set(value: ProductComponentForm) {
        this.$emit('input', value)
      },
    },
  },

  watch: {
    product: {
      immediate: true,
      handler() {
        this.fetchSales()
      },
    },
  },

  methods: {
    // TODO: WRONG TYPE! WRONG DATA! FIXME!
    formatPrice(prices: Price[]) {
      const amount = parsePrices(prices, this.$accessor.config.currency)
      return formatCurrency(amount, this.$accessor.config.currency)
    },

    async fetchSales() {
      try {
        const sales = await sdk.Products.getProductSales(this.product.id)
        this.sales = sales
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.product-aside-details {
  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__price {
    margin: 12px 0;
    font-weight: 600;
    font-size: 1.2em;
  }

  &__sales {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
