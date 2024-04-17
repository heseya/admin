<template>
  <div>
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search').toString()"
      allow-clear
      @input="debouncedSearch"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "hasRelationships": "Czy posiada relacje",
    "mediaType": "Typ mediów"
  },
  "en": {
    "hasRelationships": "Has relationships",
    "mediaType": "Media type"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import { defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'

export type PagesFiltersType = {
  search: string
}

export const EMPTY_MEDIA_FILTERS: PagesFiltersType = {
  search: '',
}

export default defineComponent({
  props: {
    filters: {
      type: Object as PropType<PagesFiltersType>,
      default: () => ({ ...EMPTY_MEDIA_FILTERS }),
    },
  },

  data: () => ({
    local: {
      ...EMPTY_MEDIA_FILTERS,
    },
  }),

  watch: {
    filters(filters: PagesFiltersType) {
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
