<template>
  <div>
    <PaginatedList
      :title="$t('title').toString()"
      :filters="filters"
      :table="tableConfig"
      :xlsx-file-config="fileConfig"
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
            <b>{{ value }}</b>

            <a-tooltip v-if="item.comment">
              <template #title> {{ item.comment }} </template>
              <span class="order-icon"> <i class="bx bxs-comment-detail"></i> </span>
            </a-tooltip>

            <a-tooltip v-if="item.summary_paid > item.summary">
              <template #title>
                {{ $t('overpaid') }}
                <b>{{ formatCurrency(item.summary_paid - item.summary, item.currency) }}</b>
              </template>
              <span class="order-icon"> <i class="bx bxs-error"></i> </span>
            </a-tooltip>
          </template>

          <template #billing_address="{ rawValue, item }">
            {{ rawValue.name }}
            <button class="order-email-btn" @click.prevent="copyToClipboard(item.email)">
              ({{ item.email }} <i class="bx bx-copy"></i>)
            </button>
          </template>

          <template #paid="{ rawValue, item }">
            <span v-if="rawValue" class="order-tag success-text">{{ $t('payment.paid') }}</span>
            <span
              v-else-if="item?.shipping_method?.payment_on_delivery"
              class="order-tag warning-text"
              >{{ $t('payment.onDelivery') }}</span
            >
            <span v-else class="order-tag danger-text">{{ $t('payment.notPaid') }}</span>
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
    "payment": {
      "paid": "Opłacone",
      "notPaid": "Nieopłacone",
      "onDelivery": "Za pobraniem"
    },
    "copySuccess": "Skopiowiano do schowka",
    "form": {
      "code": "Kod zamówienia",
      "clientName": "Klient",
      "summary": "Wartość",
      "paid": "Płatność",
      "status": "Status",
      "digital_shipping": "Przesyłka cyfrowa",
      "shipping": "Przesyłka",
      "sales_channel": "Kanał sprzedaży",
      "date": "Data"
    }
  },
  "en": {
    "title": "Orders",
    "overpaid": "Overpaid",
    "payment": {
      "paid": "Paid",
      "notPaid": "Not paid",
      "onDelivery": "On delivery"
    },
    "copySuccess": "Copied to clipboard",
    "form": {
      "code": "Order code",
      "clientName": "Client",
      "summary": "Value",
      "paid": "Payment",
      "status": "Status",
      "digital_shipping": "Digital shipping",
      "shipping": "Shipping",
      "sales_channel": "Sales channel",
      "date": "Date"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Order, OrderStatus, ShippingMethod } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import OrderFilter, {
  EMPTY_ORDER_FILTERS,
  OrderFilersType,
} from '@/components/modules/orders/OrderFilter.vue'

import { ALL_FILTER_VALUE } from '@/consts/filters'

import { TableConfig } from '@/interfaces/CmsTable'
import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'

import { formatFilters } from '@/utils/utils'
import { formatDate } from '@/utils/dates'
import { formatCurrency } from '@/utils/currency'

export default defineComponent({
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
          { key: 'code', label: this.$t('form.code') as string, sortable: true, width: '0.8fr' },
          { key: 'billing_address', label: this.$t('form.clientName') as string, width: '1.5fr' },
          {
            key: 'summary',
            label: this.$t('form.summary') as string,
            sortable: true,
            render: (v, order) => this.formatCurrency(v, order.currency),
          },
          { key: 'paid', label: this.$t('form.paid') as string, width: '0.8fr' },
          { key: 'status', label: this.$t('form.status') as string, width: '0.8fr' },
          {
            key: 'shipping_method',
            label: this.$t('form.shipping') as string,
            render: (_v, r) =>
              [r.shipping_method?.name, r.digital_shipping_method?.name]
                .filter(Boolean)
                .join(', ') || '-',
          },
          {
            key: 'sales_channel',
            label: this.$t('form.sales_channel') as string,
            render: (_, r) => r.sales_channel?.name || '-',
          },
          {
            key: 'created_at',
            label: this.$t('form.date') as string,
            sortable: true,
            render: (v) => formatDate(v) || '?',
          },
        ],
      }
    },
    fileConfig(): XlsxFileConfig<Order> {
      return {
        name: this.$t('title') as string,
        headers: [
          { key: 'code', label: this.$t('form.code') as string },
          {
            key: 'email',
            label: this.$t('form.clientName') as string,
          },
          { key: 'summary', label: this.$t('form.summary') as string },
          {
            key: 'paid',
            label: this.$t('form.paid') as string,
            format: (isPaid: boolean, order) => {
              if (isPaid) return this.$t('payment.paid').toString()
              return order?.shipping_method?.payment_on_delivery
                ? this.$t('payment.onDelivery').toString()
                : this.$t('payment.notPaid').toString()
            },
          },
          {
            key: 'status',
            label: this.$t('form.status') as string,
            format: (v: OrderStatus) => v.name,
          },
          {
            key: 'shipping_method',
            label: this.$t('form.shipping') as string,
            format: (v: ShippingMethod) => v?.name || '-',
          },
          {
            key: 'digital_shipping_method',
            label: this.$t('form.digital_shipping') as string,
            format: (v: ShippingMethod) => v?.name || '-',
          },
          {
            key: 'sales_channel',
            label: this.$t('form.sales_channel') as string,
            format: (_, o) => o.sales_channel?.name || '-',
          },
          {
            key: 'created_at',
            label: this.$t('form.date') as string,
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
      digital_shipping_method_id:
        (this.$route.query.digital_shipping_method_id as string) || ALL_FILTER_VALUE,
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
    formatCurrency(value: number | string, currency: string) {
      return formatCurrency(value, currency)
    },
    async copyToClipboard(value: string) {
      await navigator.clipboard.writeText(value)
      this.$toast.info(this.$t('copySuccess') as string)
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
    background-color: var(--black-color);
    padding: 3px 4px 2px;
    border-radius: 50%;
    color: var(--white-color);
    font-size: 0.6em;
    margin-left: 4px;
    position: relative;
    top: -3px;
  }

  .order-email-btn {
    all: unset;
    font-size: 0.7em;
    cursor: pointer;
    color: var(--gray-color-600);
    transition: color 0.3s;
    white-space: nowrap;

    @media ($viewport-4) {
      font-size: 0.8em;
    }

    &:hover {
      color: var(--primary-color-500);
    }
  }
}
</style>
