<template>
  <div>
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search')"
      allow-clear
      :placeholder="$t('common.yes')"
      @input="debouncedSearch"
    />

    <app-select
      v-model="local.visibility"
      :label="$t('visibility')"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :key="0" :label="$t('common.no')">
        {{ $t('common.no') }}
      </a-select-option>
      <a-select-option :key="1" :label="$t('common.yes')">
        {{ $t('common.yes') }}
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "visibility": "Widoczność"
  },
  "en": {
    "visibility": "Visibility"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export const EMPTY_PRODUCT_SET_FILTERS = {
  search: '',
  visibility: ALL_FILTER_VALUE,
}

type ProductSetFilters = typeof EMPTY_PRODUCT_SET_FILTERS

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_PRODUCT_SET_FILTERS }),
    } as Vue.PropOptions<ProductSetFilters>,
  },
  data: () => ({
    local: { ...cloneDeep(EMPTY_PRODUCT_SET_FILTERS) },
  }),
  watch: {
    filters(filters: ProductSetFilters) {
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
