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
      "price": "Cena netto"
    }
  },
  "en": {
    "form": {
      "price": "Price (net)"
    }
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { Currency, parsePriceDtos } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'

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

  watch: {
    value: {
      handler() {
        if (this.value.prices_base.length !== this.currencies.length) {
          this.form.prices_base = this.currencies.map((currency) => ({
            currency: currency.code,
            value: '0',
          }))
        }
      },
      immediate: true,
    },
  },

  methods: {
    getPriceValue(currency: string): number {
      return parsePriceDtos(this.form.prices_base, currency)
    },
    setPriceValue(currency: string, value: number) {
      const pricesCopy = [...this.form.prices_base]

      const currencyIndex = pricesCopy.findIndex((price) => price.currency === currency)
      if (currencyIndex === -1) {
        pricesCopy.push({
          currency,
          value: value.toString(),
        })
      } else {
        pricesCopy[currencyIndex].value = value.toString()
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
