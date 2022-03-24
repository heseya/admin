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
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Kody rabatowe",
    "add": "Dodaj kod rabatowy",
    "table": {
      "code": "Kod",
      "used": "Wykorzystano"
    }
  },
  "en": {
    "title": "Discount coupon",
    "add": "Add discount coupon",
    "table": {
      "code": "Code",
      "used": "Used"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import { Coupon } from '@/interfaces/SalesAndCoupons'

import { TableConfig } from '@/interfaces/CmsTable'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    CmsTableRow,
  },
  computed: {
    tableConfig(): TableConfig<Coupon> {
      return {
        headers: [
          { key: 'code', label: this.$t('table.code') as string, width: '0.5fr' },
          { key: 'name', label: this.$t('common.form.name') as string, width: '0.5fr' },
          {
            key: 'description',
            label: this.$t('common.form.description') as string,
          },
          { key: 'uses', label: this.$t('table.used') as string, width: '0.5fr' },
        ],
      }
    },
  },
})
</script>
