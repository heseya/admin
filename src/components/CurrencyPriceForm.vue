<template>
  <div class="currency-price-form">
    <validated-input
      v-for="currency in currencies"
      :key="currency.code"
      :value="getPriceValue(currency.code)"
      rules="required|not-negative"
      type="number"
      step="0.01"
      :label="`${label || $t('form.price')} - ${currency.code}`"
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
import { Currency, PriceDto, parsePriceDtos } from '@heseya/store-core'

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<PriceDto[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },

  computed: {
    currencies(): Currency[] {
      return this.$accessor.config.currencies
    },

    form: {
      get(): PriceDto[] {
        return this.value
      },
      set(value: PriceDto[]) {
        this.$emit('input', value)
      },
    },
  },

  watch: {
    value: {
      handler() {
        if (this.value.length !== this.currencies.length) {
          this.form = this.currencies.map((currency) => ({
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
      return parsePriceDtos(this.form, currency)
    },
    setPriceValue(currency: string, value: number) {
      const pricesCopy = [...this.form]

      const currencyIndex = pricesCopy.findIndex((price) => price.currency === currency)
      if (currencyIndex === -1) {
        pricesCopy.push({
          currency,
          value: value.toString(),
        })
      } else {
        pricesCopy[currencyIndex].value = value.toString()
      }

      this.form = pricesCopy
    },
  },
})
</script>

<style lang="scss" scoped>
.currency-price-form {
}
</style>
