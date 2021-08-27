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

    <app-select v-model="sets" label="Kolekcja" add-all @change="debouncedSearch">
      <a-select-option v-for="set in productSets" :key="set.id" :label="set.name" :value="set.slug">
        {{ set.name }}
      </a-select-option>
    </app-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  sets: ALL_FILTER_VALUE,
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
    search: '',
    sets: ALL_FILTER_VALUE,
  }),
  computed: {
    productSets() {
      return this.$accessor.productSets.getData
    },
  },
  watch: {
    filters(f: { search: string; set: string }) {
      this.search = f.search
      this.sets = f.set
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
        set: this.sets,
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
