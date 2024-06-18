<template>
  <div class="currency-price-form">
    <validated-input
      v-for="currency in currencies"
      :key="currency.code"
      :value="getPriceValue(currency.code)"
      :rules="getRules(currency.code)"
      type="number"
      step="0.01"
      :label="`${label || priceLabel} - ${currency.code}`"
      :name="`${name}${currency.code}`"
      :disabled="disabled"
      :precision="currency.decimal_places"
      @input="setPriceValue(currency.code, $event)"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { Currency, PriceDto, parsePriceDtos } from '@heseya/store-core'

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<PriceDto[] | null>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: [String, Function],
      default: 'required|not-negative',
    },
    name: {
      type: String,
      default: 'price_',
    },
  },

  computed: {
    currencies(): Currency[] {
      return this.$accessor.config.currencies
    },

    /**
     * If all sales channels have a VAT rate equal to 0, we can surlly assume that all prices are gross.
     */
    priceLabel(): string {
      return `${this.$t('common.price')} ${this.$t(
        this.$accessor.config.allPricesGross ? 'common.gross' : 'common.net',
      )
        .toString()
        .toLowerCase()}`
    },

    form: {
      get(): PriceDto[] {
        return this.value ?? []
      },
      set(value: PriceDto[]) {
        this.$emit('input', value)
      },
    },
  },

  watch: {
    value: {
      handler() {
        if (this.value?.length !== this.currencies.length) {
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
    getRules(currency: string) {
      return typeof this.rules === 'function' ? this.rules(currency) : this.rules
    },
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
