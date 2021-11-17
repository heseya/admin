<template>
  <div class="orders-filter">
    <app-input
      v-model="search"
      class="span-2"
      type="search"
      label="Wyszukiwanie"
      allow-clear
      @input="debouncedSearch"
    />

    <app-select v-model="status_id" label="Status" add-all @change="debouncedSearch">
      <a-select-option v-for="s in statuses" :key="s.id" :value="s.id">
        {{ s.name }}
      </a-select-option>
    </app-select>

    <app-select v-model="shipping_method_id" label="Dostawa" add-all @change="debouncedSearch">
      <a-select-option v-for="method in shippingMethods" :key="method.id" :value="method.id">
        {{ method.name }}
      </a-select-option>
    </app-select>
  </div>
</template>

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
  sort?: string
}

export const EMPTY_ORDER_FILTERS: OrderFilersType = {
  search: '',
  status_id: ALL_FILTER_VALUE,
  shipping_method_id: ALL_FILTER_VALUE,
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
    search: '',
    status_id: ALL_FILTER_VALUE,
    shipping_method_id: ALL_FILTER_VALUE,
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
    filters(f: OrderFilersType) {
      this.search = f.search
      this.status_id = f.status_id
      this.shipping_method_id = f.shipping_method_id
    },
  },
  created() {
    this.$accessor.statuses.fetch()
    this.$accessor.shippingMethods.fetch()
  },
  mounted() {
    this.search = this.filters.search
    this.status_id = this.filters.status_id
    this.shipping_method_id = this.filters.shipping_method_id
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        ...this.filters,
        search: this.search,
        status_id: this.status_id,
        shipping_method_id: this.shipping_method_id,
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
