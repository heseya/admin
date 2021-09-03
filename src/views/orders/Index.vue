<template>
  <div>
    <PaginatedList
      title="Zamówienia"
      :filters="filters"
      :table="tableConfig"
      store-key="orders"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <order-filter :filters="filters" @search="makeSearch" />
      </template>

      <template v-slot="{ item: order }">
        <cms-table-row :item="order" :headers="tableConfig.headers" :to="`/orders/${order.id}`">
          <template v-slot:code="{ value }"> custom:{{ value }} </template>
        </cms-table-row>
        <!-- <list-item :key="order.id" :url="`/orders/${order.id}`">
          <template #avatar>
            <vs-avatar :success="order.payed" :danger="!order.payed">
              <i class="bx bx-dollar"></i>
            </vs-avatar>
          </template>
          {{ order.code }}
          <span v-if="order.delivery_address"> - {{ order.delivery_address.name }}</span>
          <small>{{ order.summary }} {{ currency }}</small>
          <template #action>
            <div class="list-item__action--orders">
              <vs-tooltip>
                <div v-if="order.comment">
                  <i class="bx bx-comment"></i>
                </div>
                <template #tooltip>
                  {{ order.comment }}
                </template>
              </vs-tooltip>
              <div>
                <div :style="{ color: `#${order.status.color}` }">{{ order.status.name }}</div>
                <div>{{ getRelativeDate(order.created_at) }}</div>
              </div>
            </div>
          </template>
        </list-item> -->
      </template>
    </PaginatedList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { format } from 'date-fns'

import { DateInput, formatFilters, getRelativeDate } from '@/utils/utils'
import { ALL_FILTER_VALUE } from '@/consts/filters'

import OrderFilter, { EMPTY_ORDER_FILTERS } from '@/components/modules/orders/OrderFilter.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import { TableConfig } from '@/interfaces/CmsTable'

type OrderFilersType = typeof EMPTY_ORDER_FILTERS

export default Vue.extend({
  components: {
    OrderFilter,
    PaginatedList,
    CmsTableRow,
  },
  data: () => ({
    filters: { ...EMPTY_ORDER_FILTERS } as OrderFilersType,
  }),
  computed: {
    currency(): string {
      return this.$accessor.currency
    },
    tableConfig(): TableConfig {
      return {
        headers: [
          { key: 'code', label: 'Kod zamówienia' },
          {
            key: 'created_at',
            label: 'Data',
            render: (v: any) => format(new Date(v), 'dd-MM-yyyy'),
          },
          { key: 'summary', label: 'Wartość' },
          { key: 'payed', label: 'Płatność', render: (v: any) => (v ? 'Opłacone' : 'Nieopłacone') },
          { key: 'status', label: 'Status', render: (v: any) => v.name },
          { key: 'shipping_method', label: 'Przesyłka', render: () => 'DHL' },
          { key: 'email', label: 'Klient' },
        ],
      }
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.status_id = (this.$route.query.status_id as string) || ALL_FILTER_VALUE
    this.filters.shipping_method_id =
      (this.$route.query.shipping_method_id as string) || ALL_FILTER_VALUE
  },
  methods: {
    getRelativeDate(date: DateInput) {
      return getRelativeDate(date)
    },
    makeSearch(filters: OrderFilersType) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'orders',
        query: { page: undefined, ...queryFilters },
      })
    },
    clearFilters() {
      this.makeSearch({ ...EMPTY_ORDER_FILTERS })
    },
  },
})
</script>

<style lang="scss" scoped>
.list-item__action--orders {
  display: flex;
  align-items: center;

  .bx-comment {
    margin: 0 12px;
  }
}
</style>
