<template>
  <div>
    <PaginatedList
      :title="$t('title')"
      :filters="filters"
      :table="tableConfig"
      store-key="orders"
      class="orders-list"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <order-filter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: order }">
        <cms-table-row
          :key="order.id"
          :item="order"
          :headers="tableConfig.headers"
          :to="`/orders/${order.id}`"
        >
          <template #code="{ value, item }">
            {{ value }}
            <a-tooltip v-if="item.comment">
              <template #title> {{ item.comment }} </template>
              <span class="order-icon"> <i class="bx bxs-comment-detail"></i> </span>
            </a-tooltip>

            <a-tooltip v-if="item.summary_paid > item.summary">
              <template #title>
                {{ $t('overpaid') }}
                <b>{{ formatCurrency(item.summary_paid - item.summary) }}</b>
              </template>
              <span class="order-icon"> <i class="bx bxs-error"></i> </span>
            </a-tooltip>
          </template>
          <template #paid="{ rawValue }">
            <span v-if="rawValue" class="order-tag success-text">{{ $t('paid') }}</span>
            <span v-else class="order-tag danger-text">{{ $t('notpaid') }}</span>
          </template>
          <template #status="{ rawValue: { name, color } }">
            <span class="order-tag" :style="{ color: `#${color}` }"> {{ name }} </span>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Zamówienia",
    "overpaid": "Nadpłacono",
    "paid": "Opłacone",
    "notpaid": "Nieopłacone",
    "form": {
      "code": "Kod zamówienia",
      "clientName": "Klient",
      "summary": "Wartość",
      "paid": "Płatność",
      "status": "Status",
      "shipping": "Przesyłka",
      "date": "Data"
    }
  },
  "en": {
    "title": "Orders",
    "overpaid": "Overpaid",
    "paid": "Paid",
    "notpaid": "Not paid",
    "form": {
      "code": "Order code",
      "clientName": "Client",
      "summary": "Value",
      "paid": "Payment",
      "status": "Status",
      "shipping": "Shipping",
      "date": "Date"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import OrderFilter, {
  EMPTY_ORDER_FILTERS,
  OrderFilersType,
} from '@/components/modules/orders/OrderFilter.vue'

import { ALL_FILTER_VALUE } from '@/consts/filters'

import { TableConfig } from '@/interfaces/CmsTable'

import { formatFilters } from '@/utils/utils'
import { formatDate } from '@/utils/dates'
import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
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
          { key: 'code', label: this.$t('form.code') as string, sortable: true },
          { key: 'delivery_address.name', label: this.$t('form.clientName') as string },
          {
            key: 'summary',
            label: this.$t('form.summary') as string,
            sortable: true,
            render: (v) => this.formatCurrency(v),
          },
          { key: 'paid', label: this.$t('form.paid') as string, width: '0.8fr' },
          { key: 'status', label: this.$t('form.status') as string, width: '0.8fr' },
          { key: 'shipping_method.name', label: this.$t('form.shipping') as string },
          {
            key: 'created_at',
            label: this.$t('form.date') as string,
            sortable: true,
            render: (v) => formatDate(v),
          },
        ],
      }
    },
  },
  created() {
    this.filters = {
      search: (this.$route.query.search as string) || '',
      status_id: (this.$route.query.status_id as string) || ALL_FILTER_VALUE,
      shipping_method_id: (this.$route.query.shipping_method_id as string) || ALL_FILTER_VALUE,
      paid: (this.$route.query.paid as string) || ALL_FILTER_VALUE,
      sort: (this.$route.query.sort as string) || '',
    }
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
    formatCurrency(value: number) {
      return formatCurrency(value, this.$accessor.currency)
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
