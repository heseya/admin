<template>
  <div class="products-filter">
    <vs-input type="search" v-model="search" @keydown.enter="makeSearch" label="Wyszukiwanie" />

    <vs-select v-model="category" label="Kategoria" :key="'cat' + categories.length" filter>
      <vs-option label="Wszystkie" :value="0">
        Wszystkie
      </vs-option>
      <vs-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id">
        {{ cat.name }}
      </vs-option>
    </vs-select>

    <br />

    <vs-select v-model="brand" label="Marka" :key="'brand' + brands.length" filter>
      <vs-option label="Wszystkie" :value="0">
        Wszystkie
      </vs-option>
      <vs-option v-for="b in brands" :key="b.id" :label="b.name" :value="b.id">
        {{ b.name }}
      </vs-option>
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

const CLEAN_FILTERS = {
  search: '',
  category: 0,
  brand: 0,
}

export default {
  data: () => ({
    ...CLEAN_FILTERS,
  }),
  props: {
    filters: {
      type: Object,
      default: () => ({ ...CLEAN_FILTERS }),
    },
  },
  watch: {
    filters(f) {
      this.search = f.search
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
      this.$emit('search', { search: this.search, category: this.category, brand: this.brand })
    },
    clearFilters() {
      this.$emit('search', clone(CLEAN_FILTERS))
    },
  },
  mounted() {
    this.$store.dispatch('categories/fetch')
    this.$store.dispatch('brands/fetch')

    this.search = this.filters.search
    this.category = this.filters.category
    this.brand = this.filters.brand
  },
}
</script>

<style lang="scss" scoped>
.products-filter {
}
</style>
