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

    <app-input
      v-model="local.date"
      class="span-2"
      type="date"
      :label="$t('common.form.date')"
      allow-clear
      @input="debouncedSearch"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'

export type DepositsFilersType = {
  search: string
  date: string
  sort?: string
}

export const EMPTY_DEPOSITS_FILTERS: DepositsFilersType = {
  search: '',
  date: '',
  sort: undefined,
}

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_DEPOSITS_FILTERS }),
    } as Vue.PropOptions<DepositsFilersType>,
  },
  data: () => ({
    local: {
      ...EMPTY_DEPOSITS_FILTERS,
    },
  }),
  watch: {
    filters(filters: DepositsFilersType) {
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
