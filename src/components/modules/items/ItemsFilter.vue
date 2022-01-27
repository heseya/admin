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
      v-model="local.sold_out"
      label="Status w magazynie"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="'1'" label="Wyprzedane"> Wyprzedane </a-select-option>
      <a-select-option :value="'0'" label="Dostępne"> Dostępne </a-select-option>
    </app-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export type ItemsFilersType = {
  search: string
  // eslint-disable-next-line camelcase
  sold_out: string
  sort?: string
}

export const EMPTY_ITEMS_FILTERS: ItemsFilersType = {
  search: '',
  sold_out: ALL_FILTER_VALUE,
  sort: undefined,
}

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_ITEMS_FILTERS }),
    } as Vue.PropOptions<ItemsFilersType>,
  },
  data: () => ({
    local: {
      ...EMPTY_ITEMS_FILTERS,
    },
  }),
  watch: {
    filters(filters: ItemsFilersType) {
      this.local = { ...this.local, ...filters }
    },
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
