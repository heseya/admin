<template>
  <div class="products-filter">
    <app-input
      v-model="search"
      class="span-2"
      type="search"
      label="Wyszukiwanie"
      allow-clear
      @input="debouncedSearch"
    />

    <app-select v-model="sets[0]" label="Kolekcja" add-all @change="debouncedSearch">
      <a-select-option v-for="set in productSets" :key="set.id" :label="set.name" :value="set.slug">
        {{ set.name }}
      </a-select-option>
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
    ...cloneDeep(EMPTY_PRODUCT_FILTERS),
  }),
  computed: {
    productSets() {
      return this.$accessor.productSets.getData
    },
  },
  watch: {
    filters(f: ProductFilers) {
      this.search = f.search
      this.sets = f.sets
    },
  },
  created() {
    this.$accessor.productSets.fetch({ tree: undefined })
  },
  mounted() {
    this.search = this.filters.search
    this.sets = this.filters.sets
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        search: this.search,
        sets: this.sets,
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
