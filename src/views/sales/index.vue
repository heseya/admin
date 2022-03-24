<template>
  <div>
    <PaginatedList :title="$t('title')" store-key="sales" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Sales.Add" to="/sales/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: sale }">
        <cms-table-row
          :key="sale.id"
          :item="sale"
          :headers="tableConfig.headers"
          :to="`/sales/${sale.id}`"
        >
          <template #description="{ rawValue }">
            <small>{{ rawValue || '-' }}</small>
          </template>
          <template #value="{ rawValue }">
            -{{ sale.type === DiscountType.Percentage ? `${rawValue}%` : formatCurrency(rawValue) }}
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Promocje",
    "add": "Dodaj promocje",
    "table": {
      "code": "Kod",
      "value": "Wartość",
      "used": "Zastosowano"
    }
  },
  "en": {
    "title": "Sales",
    "add": "Add sale",
    "table": {
      "code": "Code",
      "value": "Value",
      "used": "Applied"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import { DiscountType, Sale } from '@/interfaces/SalesAndCoupons'

import { TableConfig } from '@/interfaces/CmsTable'
import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    CmsTableRow,
  },
  computed: {
    DiscountType(): typeof DiscountType {
      return DiscountType
    },
    tableConfig(): TableConfig<Sale> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string, width: '0.5fr' },
          {
            key: 'description',
            label: this.$t('common.form.description') as string,
          },
          { key: 'value', label: this.$t('table.value') as string, width: '0.5fr' },
          { key: 'uses', label: this.$t('table.used') as string, width: '0.5fr' },
        ],
      }
    },
  },

  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
  },
})
</script>
