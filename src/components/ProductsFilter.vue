<template>
  <div class="products-filter">
    <vs-input type="search" v-model="search" @keydown.enter="makeSearch" label="Wyszukiwanie" />

    <vs-select v-model="category" label="Kategoria" :key="'cat' + productSets.length" filter>
      <vs-option label="Wszystkie" value="_all"> Wszystkie </vs-option>
      <vs-option v-for="set in productSets" :key="set.id" :label="set.name" :value="set.slug">
        {{ set.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-select v-model="brand" label="Marka" :key="'brand' + productSets.length" filter>
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
import clone from 'lodash/clone'
import { ALL_FILTER_VALUE } from '@/consts/filters'

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  category: ALL_FILTER_VALUE,
  brand: ALL_FILTER_VALUE,
}

type ProductFilers = typeof EMPTY_PRODUCT_FILTERS

export default Vue.extend({
  data: () => ({
    search: '',
    category: ALL_FILTER_VALUE,
    brand: ALL_FILTER_VALUE,
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
      this.category = f.category
      this.brand = f.brand
    },
  },
  computed: {
    productSets(): any[] {
      return this.$store.getters['productSets/getData']
    },
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        search: this.search,
        category: this.category,
        brand: this.brand,
      })
    },
    clearFilters() {
      this.$emit('search', clone(EMPTY_PRODUCT_FILTERS))
    },
  },
  created() {
    this.$store.dispatch('productSets/fetch')
  },
  mounted() {
    this.search = this.filters.search
    this.category = this.filters.category
    this.brand = this.filters.brand
  },
})
</script>

<style lang="scss" scoped>
// .products-filter {
// }
</style>
