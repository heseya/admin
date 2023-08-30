<template>
  <div class="orders-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search').toString()"
      allow-clear
      @input="debouncedSearch"
    />

    <app-select
      v-model="local.status_id"
      :label="$t('status').toString()"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="s in statuses" :key="s.id" :label="s.name">
        {{ s.name }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.shipping_method_id"
      :label="$t('shipping').toString()"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option
        v-for="method in phisicalShippingMethods"
        :key="method.id"
        :label="method.name"
      >
        {{ method.name }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.digital_shipping_method_id"
      :label="$t('digitalShipping').toString()"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option
        v-for="method in digitalShippingMethods"
        :key="method.id"
        :label="method.name"
      >
        {{ method.name }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.sales_channel_id"
      :label="$t('salesChannel').toString()"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="channel in salesChannels" :key="channel.id" :label="channel.name">
        {{ channel.name }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.paid"
      :label="$t('paymentStatus').toString()"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="'1'" :label="$t('paid')"> {{ $t('paid') }} </a-select-option>
      <a-select-option :value="'0'" :label="$t('notpaid')"> {{ $t('notpaid') }} </a-select-option>
    </app-select>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "status": "Status",
    "shipping": "Dostawa",
    "digitalShipping": "Cyfrowa dostawa",
    "paymentStatus": "Status płatności",
    "salesChannel": "Kanał sprzedaży",
    "paid": "Opłacone",
    "notpaid": "Nie opłacone"
  },
  "en": {
    "status": "Status",
    "shipping": "Shipping",
    "digitalShipping": "Digital shipping",
    "paymentStatus": "Payment status",
    "salesChannel": "Sales channel",
    "paid": "Paid",
    "notpaid": "Not paid"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import { defineComponent, PropType } from 'vue'
import { debounce } from 'lodash'
import { OrderStatus, ShippingMethod, ShippingType } from '@heseya/store-core'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import { SalesChannel } from '@heseya/store-core'

export type OrderFilersType = {
  search: string
  status_id: string
  shipping_method_id: string
  digital_shipping_method_id: string
  sales_channel_id: string
  paid: string
  sort?: string
}

export const EMPTY_ORDER_FILTERS: OrderFilersType = {
  search: '',
  status_id: ALL_FILTER_VALUE,
  shipping_method_id: ALL_FILTER_VALUE,
  digital_shipping_method_id: ALL_FILTER_VALUE,
  sales_channel_id: ALL_FILTER_VALUE,
  paid: ALL_FILTER_VALUE,
  sort: undefined,
}

export default defineComponent({
  props: {
    filters: {
      type: Object as PropType<OrderFilersType>,
      default: () => ({ ...EMPTY_ORDER_FILTERS }),
    },
  },
  data: () => ({
    local: {
      ...EMPTY_ORDER_FILTERS,
    },
  }),
  computed: {
    statuses(): OrderStatus[] {
      return this.$accessor.statuses.getData
    },
    digitalShippingMethods(): ShippingMethod[] {
      return this.$accessor.shippingMethods.getData.filter(
        (m) => m.shipping_type === ShippingType.Digital,
      )
    },
    phisicalShippingMethods(): ShippingMethod[] {
      return this.$accessor.shippingMethods.getData.filter(
        (m) => m.shipping_type !== ShippingType.Digital,
      )
    },
    salesChannels(): SalesChannel[] {
      return this.$accessor.salesChannels.getData
    },
  },
  watch: {
    filters(filters: OrderFilersType) {
      this.local = { ...this.local, ...filters }
    },
  },
  created() {
    this.$accessor.statuses.fetch({ limit: 500 })
    this.$accessor.shippingMethods.fetch({ limit: 500 })
    this.$accessor.salesChannels.fetch({ limit: 500 })
  },
  mounted() {
    this.local = { ...this.local, ...this.filters }
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        ...this.filters,
        ...this.local,
      })
    },

    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
  },
})
</script>
