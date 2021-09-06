<template>
  <div class="products-filter">
    <vs-input v-model="search" type="search" label="Wyszukiwanie" @keydown.enter="makeSearch" />

    <vs-select :key="productSets.length" v-model="sets[0]" label="Kolekcje" filter>
      <vs-option label="Wszystkie" value="_all"> Wszystkie </vs-option>
      <vs-option v-for="set in productSets" :key="set.id" :label="set.name" :value="set.slug">
        {{ set.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-button color="dark" @click="makeSearch"> <i class="bx bx-search"></i> Wyszukaj </vs-button>
    <vs-button transparent @click="clearFilters"> Wyczyść filtry </vs-button>
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
    clearFilters() {
      this.$emit('search', cloneDeep(EMPTY_PRODUCT_FILTERS))
    },
  },
})
</script>

<style lang="scss" scoped>
// .products-filter {
// }
</style>
