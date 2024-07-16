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
      v-model="local.has_product"
      :label="$t('hasProduct').toString()"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="'1'" :label="$t('assigned')"> {{ $t('assigned') }} </a-select-option>
      <a-select-option :value="'0'" :label="$t('notAssigned')">
        {{ $t('notAssigned') }}
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "hasProduct": "Schemat przypisany do produktu",
    "assigned": "Tak",
    "notAssigned": "Nie"
  },
  "en": {
    "hasProduct": "Schema assigned to product",
    "assigned": "Yes",
    "notAssigned": "No"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import { defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export type SchemaFilersType = {
  search: string
  has_product: string
}

export const EMPTY_SCHEMA_FILTERS: SchemaFilersType = {
  search: '',
  has_product: ALL_FILTER_VALUE,
}

export default defineComponent({
  props: {
    filters: {
      type: Object as PropType<SchemaFilersType>,
      default: () => ({ ...EMPTY_SCHEMA_FILTERS }),
    },
  },
  data: () => ({
    local: {
      ...EMPTY_SCHEMA_FILTERS,
    },
  }),
  watch: {
    filters(filters: SchemaFilersType) {
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
