<template>
  <div class="products-filter">
    <vs-input type="search" v-model="search" @keydown.enter="makeSearch" label="Wyszukiwanie" />

    <vs-select v-model="category" label="Kategoria" :key="'cat' + categories.length" filter>
      <vs-option label="Wszystkie" value="_all">
        Wszystkie
      </vs-option>
      <vs-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.slug">
        {{ cat.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-select v-model="brand" label="Marka" :key="'brand' + brands.length" filter>
      <vs-option label="Wszystkie" value="_all">
        Wszystkie
      </vs-option>
      <vs-option v-for="b in brands" :key="b.id" :label="b.name" :value="b.slug">
        {{ b.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-select v-model="limit" label="Maksymalna liczba elementów na stronie" filter>
      <vs-option label="12" :value="12"> 12 </vs-option>
      <vs-option label="24" :value="24"> 24 </vs-option>
      <vs-option label="36" :value="36"> 36 </vs-option>
      <vs-option label="48" :value="48"> 48 </vs-option>
      <vs-option label="64" :value="64"> 64 </vs-option>
      <vs-option label="128" :value="128"> 128 </vs-option>
      <vs-option label="256" :value="256"> 256 </vs-option>
      <vs-option label="512" :value="512"> 512 </vs-option>
      <vs-option label="1024" :value="1024"> 1024 </vs-option>
    </vs-select>

    <br />

    <vs-button @click="makeSearch" color="dark"> <i class="bx bx-search"></i> Wyszukaj </vs-button>
    <vs-button @click="clearFilters" transparent>
      Wyczyść filtry
    </vs-button>
  </div>
</template>

<script>
import clone from 'lodash/clone'

export const ALL_FILTER_VALUE = '_all'

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  limit: 12,
  category: ALL_FILTER_VALUE,
  brand: ALL_FILTER_VALUE,
}

export default {
  data: () => ({
    search: '',
    limit: 12,
    category: ALL_FILTER_VALUE,
    brand: ALL_FILTER_VALUE,
  }),
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_PRODUCT_FILTERS }),
    },
  },
  watch: {
    filters(f) {
      this.search = f.search
      this.limit = f.limit
      this.category = f.category
      this.brand = f.brand
    },
  },
  computed: {
    categories() {
      return this.$store.getters['categories/getData']
    },
    brands() {
      return this.$store.getters['brands/getData']
    },
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        search: this.search,
        category: this.category,
        brand: this.brand,
        limit: this.limit,
      })
    },
    clearFilters() {
      this.$emit('search', clone(EMPTY_PRODUCT_FILTERS))
    },
  },
  created() {
    this.$store.dispatch('categories/fetch')
    this.$store.dispatch('brands/fetch')
  },
  mounted() {
    this.search = this.filters.search
    this.category = this.filters.category
    this.brand = this.filters.brand
    this.limit = this.filters.limit
  },
}
</script>

<style lang="scss" scoped>
// .products-filter {
// }
</style>
