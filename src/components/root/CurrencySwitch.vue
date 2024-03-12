<template>
  <div class="currency-switch">
    <app-select v-model="selectedCurrency" class="currency-switch__select">
      <a-select-option
        v-for="currency in currencies"
        :key="currency.code"
        :value="currency.code"
        :label="currency.name"
      >
        <span class="currency-switch__option"> {{ $t('name') }}: {{ currency.name }} </span>
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "name": "Currency"
  },
  "pl": {
    "name": "Waluta"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Currency } from '@heseya/store-core'

export default defineComponent({
  computed: {
    currencies(): Currency[] {
      return this.$accessor.config.currencies
    },
    selectedCurrency: {
      get(): string | undefined {
        return this.$accessor.config.currency
      },
      set(code: string) {
        this.$accessor.config.SET_CURRENCY(code)
      },
    },
  },
})
</script>

<style lang="scss">
.currency-switch {
  position: relative;
  padding: 0 4px;

  &__option {
    text-transform: uppercase;
    font-size: 0.7rem !important;
    letter-spacing: 1px;
  }
}
</style>
