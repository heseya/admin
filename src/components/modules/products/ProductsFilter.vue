<template>
  <div class="products-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      label="Wyszukiwanie"
      allow-clear
      @input="debouncedSearch"
    />

    <app-select
      v-model="local.sets[0]"
      label="Kolekcja"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="set in productSets" :key="set.slug" :label="set.name">
        {{ set.name }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.tags[0]"
      label="Tagi"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="tag in apiTags" :key="tag.id" :label="tag.name">
        {{ tag.name }}
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.public"
      label="Widoczność"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="'1'" label="Tak"> Tak </a-select-option>
      <a-select-option :value="'0'" label="Nie"> Nie </a-select-option>
    </app-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  sets: [ALL_FILTER_VALUE],
  tags: [ALL_FILTER_VALUE],
  public: ALL_FILTER_VALUE,
  sort: undefined as string | undefined,
}

type ProductFilers = typeof EMPTY_PRODUCT_FILTERS

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_PRODUCT_FILTERS }),
    } as Vue.PropOptions<ProductFilers>,
  },
  data: () => ({
    local: { ...cloneDeep(EMPTY_PRODUCT_FILTERS) },
  }),
  computed: {
    productSets() {
      return this.$accessor.productSets.getData
    },
    apiTags() {
      return this.$accessor.tags.getData
    },
  },
  watch: {
    filters(filters: ProductFilers) {
      this.local = { ...this.local, ...filters }
    },
  },
  created() {
    this.$accessor.productSets.fetch({ tree: undefined })
    this.$accessor.tags.fetch({ limit: 500 })
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
    clearFilters() {
      this.$emit('search', cloneDeep(EMPTY_PRODUCT_FILTERS))
    },
  },
})
</script>
