<template>
  <div class="orders-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search')"
      allow-clear
      :placeholder="$t('search')"
      @input="debouncedSearch"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "search": "Wpisz nazwę webhooka lub link",
    "soldout": {
      "label": "Status w magazynie",
      "sold": "Wyprzedane",
      "available": "Dostępne"
    }
  },
  "en": {
    "search": "Type webhook name or link",
    "soldout": {
      "label": "Status in stock",
      "sold": "Sold out",
      "available": "Available"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep, debounce } from 'lodash'

export type WebhookFilersType = {
  search: string
}

export const EMPTY_WEBHOOK_FILTERS: WebhookFilersType = {
  search: '',
}

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_WEBHOOK_FILTERS }),
    } as Vue.PropOptions<WebhookFilersType>,
  },
  data: () => ({
    local: {
      ...EMPTY_WEBHOOK_FILTERS,
    },
  }),
  watch: {
    filters: {
      handler(filters: WebhookFilersType) {
        this.local = cloneDeep(filters)
      },
      deep: true,
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
