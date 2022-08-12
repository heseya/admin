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

    <boolean-select v-model="local.public" :label="$t('public')" @change="debouncedSearch" />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "public": "Widoczność"
  },
  "en": {
    "public": "Visibility"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import BooleanSelect from '@/components/form/BooleanSelect.vue'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export interface ProductSetFilters extends Record<string, string | string[] | undefined> {
  search: string
  public: string
  root?: string
}

export const EMPTY_PRODUCT_SET_FILTERS: ProductSetFilters = {
  search: '',
  public: ALL_FILTER_VALUE,
  root: '',
}

export default Vue.extend({
  components: { BooleanSelect },
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_PRODUCT_SET_FILTERS }),
    } as Vue.PropOptions<ProductSetFilters>,
  },

  data: () => ({
    local: { ...cloneDeep(EMPTY_PRODUCT_SET_FILTERS) },
    searchingError: false,
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
      const root = this.local.search ? false : ''
      this.$emit('search', {
        ...this.filters,
        ...this.local,
        root,
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
