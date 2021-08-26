<template>
  <div class="products-filter">
    <vs-input :value="search" type="search" label="Wyszukiwanie" @input="setSearch" />

    <vs-select :key="productSets.length" :value="sets" label="Kolekcja" filter @input="setSet">
      <vs-option label="Wszystkie" value="_all"> Wszystkie </vs-option>
      <vs-option v-for="set in productSets" :key="set.id" :label="set.name" :value="set.slug">
        {{ set.name }}
      </vs-option>
    </vs-select>
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
    setSearch(search: string) {
      this.search = search
      this.debouncedSearch()
    },
    setSet(sets: string) {
      this.sets = sets
      this.debouncedSearch()
    },

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

<style lang="scss" scoped>
.products-filter {
  & *:first-child {
    grid-column: 1 / span 2;
  }
}
</style>
