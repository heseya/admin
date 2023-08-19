<template>
  <div>
    <PaginatedList
      :title="$t('title').toString()"
      store-key="coupons"
      :table="tableConfig"
      :filters="filters"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.Coupons.Add" to="/coupons/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <div>
          <app-input
            v-model="filters.search"
            class="span-2"
            type="search"
            :label="$t('common.search')"
            allow-clear
            @input="debouncedSearch"
          />
        </div>
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
          <template #value>
            -{{
              coupon.percentage ? `${parseFloat(coupon.percentage)}%` : formatPrice(coupon.amounts)
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
      "used": "Wykorzystano",
      "active": "Aktywny"
    }
  },
  "en": {
    "title": "Discount coupon",
    "add": "Add discount coupon",
    "table": {
      "code": "Code",
      "value": "Value",
      "target_type": "Target type",
      "used": "Used",
      "active": "Active"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { debounce } from 'lodash'
import { Coupon, Price, parsePrices } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import { TableConfig } from '@/interfaces/CmsTable'
import { formatCurrency } from '@/utils/currency'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },

  components: {
    PaginatedList,
    CmsTableRow,
  },

  data: () => ({
    filters: {
      search: '',
    },
  }),

  computed: {
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
          { key: 'active', label: this.$t('table.active') as string },
        ],
      }
    },
  },

  created() {
    this.filters.search = (this.$route.query.search as string) || ''
  },

  methods: {
    makeSearch() {
      if (this.filters.search !== this.$route.query.search) {
        this.$router.push({
          path: '/coupons',
          query: { page: undefined, search: this.filters.search || undefined },
        })
      }
    },
    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
    clearFilters() {
      this.filters.search = ''
      this.makeSearch()
    },
    formatPrice(prices: Price[]) {
      const amount = parsePrices(prices, this.$accessor.config.currency)
      return formatCurrency(amount, this.$accessor.config.currency)
    },
  },
})
</script>
