<template>
  <div class="product-price-form">
    <validated-input
      v-for="currency in currencies"
      :key="currency.code"
      :value="getPriceValue(currency.code)"
      rules="required|not-negative"
      type="number"
      step="0.01"
      :label="`${$t('form.price')} - ${currency.code}`"
      :name="`price_${currency.code}`"
      :disabled="disabled"
      @input="setPriceValue(currency.code, $event)"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "price": "Cena brutto"
    }
  },
  "en": {
    "form": {
      "price": "Price (gross)"
    }
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { Currency } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'
import { parsePrices } from '@/utils/currency'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<ProductComponentForm>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    currencies(): Currency[] {
      return this.$accessor.config.currencies
    },

    form: {
      get(): ProductComponentForm {
        return this.value
      },
      set(value: ProductComponentForm) {
        this.$emit('input', value)
      },
    },
  },

  methods: {
    getPriceValue(currency: string): number {
      return parsePrices(this.form.prices_base, currency)
    },
    setPriceValue(currency: string, value: number) {
      const pricesCopy = [...this.form.prices_base]

      const currencyIndex = pricesCopy.findIndex((price) => price.currency === currency)
      if (currencyIndex === -1) {
        pricesCopy.push({
          currency,
          gross: value.toString(),
        })
      } else {
        pricesCopy[currencyIndex].gross = value.toString()
      }

      this.form.prices_base = pricesCopy
    },
  },
})
</script>

<style lang="scss" scoped>
.product-price-form {
}
</style>
