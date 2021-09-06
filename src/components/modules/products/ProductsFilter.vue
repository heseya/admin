<template>
  <div class="products-filter">
    <vs-input type="search" v-model="search" @keydown.enter="makeSearch" label="Wyszukiwanie" />

    <vs-select v-model="sets[0]" label="Kolekcje" :key="productSets.length" filter>
      <vs-option label="Wszystkie" value="_all"> Wszystkie </vs-option>
      <vs-option v-for="set in productSets" :key="set.id" :label="set.name" :value="set.slug">
        {{ set.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-button @click="makeSearch" color="dark"> <i class="bx bx-search"></i> Wyszukaj </vs-button>
    <vs-button @click="clearFilters" transparent> Wyczyść filtry </vs-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ALL_FILTER_VALUE } from '@/consts/filters'

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  sets: [ALL_FILTER_VALUE],
}

type ProductFilers = typeof EMPTY_PRODUCT_FILTERS

export default Vue.extend({
  data: () => ({
    ...cloneDeep(EMPTY_PRODUCT_FILTERS),
  }),
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_PRODUCT_FILTERS }),
    } as Vue.PropOptions<ProductFilers>,
  },
  watch: {
    filters(f: ProductFilers) {
      this.search = f.search
      this.sets = f.sets
    },
  },
  computed: {
    productSets() {
      return this.$accessor.productSets.getData
    },
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        search: this.search,
        sets: this.sets,
      })
    },
    clearFilters() {
      this.$emit('search', cloneDeep(EMPTY_PRODUCT_FILTERS))
    },
  },
  created() {
    this.$accessor.productSets.fetch({ tree: undefined })
  },
  mounted() {
    this.search = this.filters.search
    this.sets = this.filters.sets
  },
})
</script>

<style lang="scss" scoped>
// .products-filter {
// }
</style>
