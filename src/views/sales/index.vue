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

<i18n lang="json">
{
  "pl": {
    "title": "Promocje",
    "add": "Dodaj promocje",
    "table": {
      "code": "Kod",
      "value": "Wartość rabatu",
      "target_type": "Typ celu przeceny",
      "used": "Zastosowano",
      "active": "Aktywna"
    }
  },
  "en": {
    "title": "Sales",
    "add": "Add sale",
    "table": {
      "code": "Code",
      "value": "Value",
      "target_type": "Target type",
      "used": "Applied",
      "active": "Active"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { DiscountType, Sale } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

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
          { key: 'name', label: this.$t('common.form.name') as string },
          {
            key: 'description',
            label: this.$t('common.form.description') as string,
          },
          {
            key: 'target_type',
            label: this.$t('table.target_type') as string,
            render: (key) => this.$t(`discountTargetTypes.${key}`) as string,
          },
          { key: 'value', label: this.$t('table.value') as string },
          { key: 'uses', label: this.$t('table.used') as string },
          { key: 'active', label: this.$t('table.active') as string },
        ],
      }
    },
  },

  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
    },
  },
})
</script>
