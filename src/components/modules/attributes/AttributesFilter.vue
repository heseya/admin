<template>
  <div class="attributes-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search').toString()"
      allow-clear
      @input="debouncedSearch"
    />

    <BooleanSelect
      v-model="local.global"
      :label="$t('filter.global').toString()"
      @change="debouncedSearch"
    />

    <BooleanSelect
      v-model="local.sortable"
      :label="$t('filter.sortable').toString()"
      @change="debouncedSearch"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "filter": {
      "global": "Globalny",
      "sortable": "Sortowalny"
    }
  },
  "en": {
    "filter": {
      "global": "Global",
      "sortable": "Sortable"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { debounce } from 'lodash'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import BooleanSelect from '@/components/form/BooleanSelect.vue'

export type AttributesFilersType = {
  search: string
  global: string
  sortable: string
}

export const EMPTY_ATTRIBUTES_FILTERS: AttributesFilersType = {
  search: '',
  sortable: ALL_FILTER_VALUE,
  global: ALL_FILTER_VALUE,
}

export default defineComponent({
  components: { BooleanSelect },
  props: {
    filters: {
      type: Object as PropType<AttributesFilersType>,
      default: () => ({ ...EMPTY_ATTRIBUTES_FILTERS }),
    },
  },
  data: () => ({
    local: {
      ...EMPTY_ATTRIBUTES_FILTERS,
    },
  }),
  watch: {
    filters(filters: AttributesFilersType) {
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
