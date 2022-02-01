<template>
  <div class="orders-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search')"
      allow-clear
      @input="debouncedSearch"
    />

    <app-select
      v-model="local.status_id"
      :label="$t('status')"
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
      :label="$t('shipping')"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="method in shippingMethods" :key="method.id" :label="method.name">
        {{ method.name }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.paid"
      :label="$t('paymentStatus')"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="'1'" :label="$t('paid')"> {{ $t('paid') }} </a-select-option>
      <a-select-option :value="'0'" :label="$t('notpaid')"> {{ $t('notpaid') }} </a-select-option>
    </app-select>
  </div>
</template>

<i18n>
{
  "pl": {
    "status": "Status",
    "shipping": "Dostawa",
    "paymentStatus": "Status płatności",
    "paid": "Opłacone",
    "notpaid": "Nie opłacone"
  },
  "en": {
    "status": "Status",
    "shipping": "Shipping",
    "paymentStatus": "Payment status",
    "paid": "Paid",
    "notpaid": "Not paid"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'
import { debounce } from 'lodash'

import { ALL_FILTER_VALUE } from '@/consts/filters'

import { OrderStatus } from '@/interfaces/Order'
import { ShippingMethod } from '@/interfaces/ShippingMethod'

export type OrderFilersType = {
  search: string
  status_id: string
  shipping_method_id: string
  paid: string
  sort?: string
}

export const EMPTY_ORDER_FILTERS: OrderFilersType = {
  search: '',
  status_id: ALL_FILTER_VALUE,
  shipping_method_id: ALL_FILTER_VALUE,
  paid: ALL_FILTER_VALUE,
  sort: undefined,
}

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_ORDER_FILTERS }),
    } as Vue.PropOptions<OrderFilersType>,
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
    shippingMethods(): ShippingMethod[] {
      return this.$accessor.shippingMethods.getData
    },
  },
  watch: {
    filters(filters: OrderFilersType) {
      this.local = { ...this.local, ...filters }
    },
  },
  created() {
    this.$accessor.statuses.fetch()
    this.$accessor.shippingMethods.fetch()
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
