<template>
  <div class="product-aside-details">
    <div class="product-aside-details__row">
      <h2 class="product-page__subtitle">{{ $t('visibilityTitle') }}</h2>
      <product-visibility-switch v-model="form" :product="product" :disabled="disabled" />
    </div>
    <div class="product-aside-details__row">
      <h2 class="product-page__subtitle">
        {{ $t('availability.title') }}
        <info-tooltip :text="$t('availability.tooltip')" />
      </h2>
      <boolean-tag
        :value="product.available"
        :true-text="$t('availability.available')"
        :false-text="$t('availability.unavailable')"
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
      <div v-if="product.sales && product.sales.length" class="product-aside-details__sales">
        <a v-for="sale in product.sales" :key="sale.id" :href="`/sales/${sale.id}`" target="_blank">
          <tag type="primary" small>
            {{ sale.name }} (-{{
              sale.type === DiscountType.Percentage ? sale.value + '%' : formatCurrency(sale.value)
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
import Vue from 'vue'
import { Product, DiscountType } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'
import ProductVisibilitySwitch from './ProductVisibilitySwitch.vue'
import ProductPrice from '../ProductPrice.vue'
import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  components: { ProductVisibilitySwitch, ProductPrice },
  props: {
    product: { type: Object, required: true } as Vue.PropOptions<Product>,
    disabled: { type: Boolean, default: false } as Vue.PropOptions<boolean>,
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductComponentForm>,
  },

  computed: {
    form: {
      get(): ProductComponentForm {
        return this.value
      },
      set(value: ProductComponentForm) {
        this.$emit('input', value)
      },
    },
    DiscountType(): typeof DiscountType {
      return DiscountType
    },
  },

  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
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