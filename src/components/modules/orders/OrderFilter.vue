<template>
  <div class="orders-filter">
    <vs-input v-model="search" type="search" label="Wyszukiwanie" @input="debouncedSearch" />

    <vs-select
      :key="'status' + statuses.length"
      v-model="status_id"
      label="Status"
      filter
      @input="debouncedSearch"
    >
      <vs-option label="Wszystkie" value="_all"> Wszystkie </vs-option>
      <vs-option v-for="s in statuses" :key="s.id" :label="s.name" :value="s.id">
        {{ s.name }}
      </vs-option>
    </vs-select>

    <vs-select
      :key="'shippingMethod' + shippingMethods.length"
      v-model="shipping_method_id"
      label="Dostawa"
      filter
      @input="debouncedSearch"
    >
      <vs-option label="Wszystkie" value="_all"> Wszystkie </vs-option>
      <vs-option
        v-for="method in shippingMethods"
        :key="method.id"
        :label="method.name"
        :value="method.id"
      >
        {{ method.name }}
      </vs-option>
    </vs-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import clone from 'lodash/clone'
import { debounce } from 'lodash'

import { ALL_FILTER_VALUE } from '@/consts/filters'

import { OrderStatus } from '@/interfaces/Order'
import { ShippingMethod } from '@/interfaces/ShippingMethod'

export const EMPTY_ORDER_FILTERS = {
  search: '',
  status_id: ALL_FILTER_VALUE,
  shipping_method_id: ALL_FILTER_VALUE,
}

type OrderFilers = typeof EMPTY_ORDER_FILTERS

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_ORDER_FILTERS }),
    } as Vue.PropOptions<OrderFilers>,
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
    filters(f: OrderFilers) {
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

<style lang="scss" scoped>
.orders-filter {
  & *:first-child {
    grid-column: 1 / span 2;
  }
}
</style>
