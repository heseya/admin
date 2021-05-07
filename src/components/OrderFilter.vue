<template>
  <div class="orders-filter">
    <vs-input type="search" v-model="search" @keydown.enter="makeSearch" label="Wyszukiwanie" />

    <vs-select v-model="status_id" label="Status" :key="'status' + statuses.length" filter>
      <vs-option label="Wszystkie" value="_all">
        Wszystkie
      </vs-option>
      <vs-option v-for="s in statuses" :key="s.id" :label="s.name" :value="s.id">
        {{ s.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-select v-model="shipping_method_id" label="Dostawa" :key="'shippingMethod' + shippingMethods.length" filter>
      <vs-option label="Wszystkie" value="_all">
        Wszystkie
      </vs-option>
      <vs-option v-for="method in shippingMethods" :key="method.id" :label="method.name" :value="method.id">
        {{ method.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-button @click="makeSearch" color="dark"> <i class="bx bx-search"></i> Wyszukaj </vs-button>
    <vs-button @click="clearFilters" transparent>
      Wyczyść filtry
    </vs-button>
  </div>
</template>

<script>
import clone from 'lodash/clone'

export const ALL_FILTER_VALUE = '_all'

export const EMPTY_ORDER_FILTERS = {
  search: '',
  status_id: ALL_FILTER_VALUE,
  shipping_method_id: ALL_FILTER_VALUE,
}

export default {
  data: () => ({
    search: '',
    status_id: ALL_FILTER_VALUE,
    shipping_method_id: ALL_FILTER_VALUE,
  }),
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_ORDER_FILTERS }),
    },
  },
  watch: {
    filters(f) {
      this.search = f.search
      this.status_id = f.status_id
      this.shipping_method_id = f.shipping_method_id
    },
  },
  computed: {
    statuses() {
      return this.$store.getters['statuses/getData']
    },
    shippingMethods() {
      return this.$store.getters['shippingMethods/getData']
    },
  },
  methods: {
    makeSearch() {
      this.$emit('search', { search: this.search, status_id: this.status_id, shipping_method_id: this.shipping_method_id })
    },
    clearFilters() {
      this.$emit('search', clone(EMPTY_ORDER_FILTERS))
    },
  },
  created() {
    this.$store.dispatch('statuses/fetch')
    this.$store.dispatch('shippingMethods/fetch')
  },
  mounted() {
    this.search = this.filters.search
    this.status = this.filters.status
    this.shippingMethod = this.filters.shippingMethod
  },
}
</script>

<style lang="scss" scoped>
.orders-filter {
}
</style>
