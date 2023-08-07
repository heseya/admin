<template>
  <div class="currency-switch">
    <a-tooltip>
      <app-select v-model="selectedCurrency" class="currency-switch__select">
        <a-select-option
          v-for="currency in currencies"
          :key="currency.code"
          :value="currency.code"
          :label="currency.name"
        >
          <span class="currency-switch__option"> {{ currency.name }} </span>
        </a-select-option>
      </app-select>

      <template #title> {{ $t('name') }}</template>
    </a-tooltip>
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
import { Currency } from '@heseya/store-core'
import Vue from 'vue'

export default Vue.extend({
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

  methods: {
    getFlagName(iso: string) {
      const firstIsoPart = iso.split('-')[0]
      if (firstIsoPart === 'en' || firstIsoPart === 'eng') return 'us'
      return firstIsoPart
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
