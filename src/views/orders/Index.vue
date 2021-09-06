<template>
  <div>
    <PaginatedList
      title="Zamówienia"
      :filters="filters"
      :table="tableConfig"
      store-key="orders"
      class="orders-list"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <order-filter :filters="filters" @search="makeSearch" />
      </template>

      <template v-slot="{ item: order }">
        <cms-table-row :item="order" :headers="tableConfig.headers" :to="`/orders/${order.id}`">
          <template #code="{ value, item }">
            {{ value }}
            <a-tooltip v-if="item.comment">
              <template slot="title"> {{ item.comment }} </template>
              <span class="order-icon"> <i class="bx bxs-comment-detail"></i> </span>
            </a-tooltip>
          </template>
          <template #payed="{ rawValue }">
            <span v-if="rawValue" class="order-tag success-text">Opłacone</span>
            <span v-else class="order-tag danger-text">Nieopłacone</span>
          </template>
          <template #status="{ rawValue: { name, color } }">
            <span class="order-tag" :style="{ color: `#${color}` }"> {{ name }} </span>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import OrderFilter, { EMPTY_ORDER_FILTERS } from '@/components/modules/orders/OrderFilter.vue'

import { ALL_FILTER_VALUE } from '@/consts/filters'

import { TableConfig } from '@/interfaces/CmsTable'
import { Order } from '@/interfaces/Order'

import { formatFilters, getRelativeDate } from '@/utils/utils'
import { formatCurrency } from '@/utils/currency'

type OrderFilersType = typeof EMPTY_ORDER_FILTERS

export default Vue.extend({
  metaInfo: { title: 'Zamówienia' },
  components: {
    OrderFilter,
    PaginatedList,
    CmsTableRow,
  },
  data: () => ({
    filters: { ...EMPTY_ORDER_FILTERS } as OrderFilersType,
  }),
  computed: {
    tableConfig(): TableConfig<Order> {
      return {
        rowUrlBuilder: (order) => `/orders/${order.id}`,
        headers: [
          { key: 'code', label: 'Kod zamówienia' },
          {
            key: 'created_at',
            label: 'Data',
            sortable: true,
            render: (v) => getRelativeDate(v),
          },
          {
            key: 'summary',
            label: 'Wartość',
            render: (v) => formatCurrency(v, this.$accessor.currency),
          },
          { key: 'payed', label: 'Płatność', width: '0.8fr' },
          { key: 'status', label: 'Status', width: '0.8fr' },
          { key: 'shipping_method', label: 'Przesyłka', render: () => 'DHL kurier' },
          { key: 'email', label: 'Klient', width: '2fr' },
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
.orders-list {
  .order-tag {
    text-transform: uppercase;
    font-size: 0.8em;
    letter-spacing: 1px;
  }

  .order-icon {
    display: inline-block;
    background-color: #000000;
    padding: 3px 4px 2px;
    border-radius: 50%;
    color: #ffffff;
    font-size: 0.6em;
    margin-left: 4px;
    position: relative;
    top: -3px;
  }
}
</style>
