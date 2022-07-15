<template>
  <div>
    <PaginatedList :title="$t('title')" store-key="coupons" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Coupons.Add" to="/coupons/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: coupon }">
        <cms-table-row
          :key="coupon.id"
          :item="coupon"
          :headers="tableConfig.headers"
          :to="`/coupons/${coupon.id}`"
        >
          <template #code>
            <b>{{ coupon.code }}</b>
          </template>
          <template #description="{ rawValue }">
            <small>{{ rawValue || '-' }}</small>
          </template>
          <template #value="{ rawValue }">
            -{{
              coupon.type === DiscountType.Percentage ? `${rawValue}%` : formatCurrency(rawValue)
            }}
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Kody rabatowe",
    "add": "Dodaj kod rabatowy",
    "table": {
      "code": "Kod",
      "value": "Wartość rabatu",
      "target_type": "Typ celu przeceny",
      "used": "Wykorzystano"
    }
  },
  "en": {
    "title": "Discount coupon",
    "add": "Add discount coupon",
    "table": {
      "code": "Code",
      "value": "Value",
      "target_type": "Target type",
      "used": "Used"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Coupon, DiscountType } from '@heseya/store-core'

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
    tableConfig(): TableConfig<Coupon> {
      return {
        headers: [
          { key: 'code', label: this.$t('table.code') as string },
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
