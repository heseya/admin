<template>
  <div class="currencies-page">
    <TopNav :title="$t('title').toString()" />

    <Card class="currencies-page__content">
      <Empty v-if="!items.length">
        {{ $t('common.defaultEmpty') }}
      </Empty>
      <CmsTable v-else :value="items" :config="tableConfig" no-hover />
    </Card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Lista walut",
    "currency": {
      "code": "Kod",
      "decimalPlaces": "Miejsca po przecinku"
    }
  },
  "en": {
    "title": "Currencies list",
    "currency": {
      "code": "Code",
      "decimalPlaces": "Decimal places"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import TopNav from '@/components/layout/TopNav.vue'
import Empty from '@/components/layout/Empty.vue'
import Card from '@/components/layout/Card.vue'
import CmsTable from '@/components/cms/CmsTable.vue'
import { Currency } from '@heseya/store-core'
import { TableConfig } from '@/interfaces/CmsTable'

type ComponentCurrency = Currency & { id: string }

export default defineComponent({
  components: {
    TopNav,
    Empty,
    Card,
    CmsTable,
  },

  computed: {
    items(): ComponentCurrency[] {
      return this.$accessor.config.currencies.map((currency) => ({
        ...currency,
        id: currency.code,
      }))
    },
    tableConfig(): TableConfig<ComponentCurrency> {
      return {
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name').toString(),
          },
          {
            key: 'code',
            label: this.$t('currency.code').toString(),
          },
          {
            key: 'decimal_places',
            label: this.$t('currency.decimalPlaces').toString(),
          },
        ],
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.currencies-page {
}
</style>
