<template>
  <div class="products-filter">
    <vs-input type="search" v-model="search" @keydown.enter="makeSearch" label="Wyszukiwanie" />

    <vs-select v-model="sets" label="Kolekcje" :key="productSets.length" filter>
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

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  sets: '',
}

type ProductFilers = typeof EMPTY_PRODUCT_FILTERS

export default Vue.extend({
  data: () => ({
    search: '',
    sets: '',
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
    productSets(): any[] {
      return this.$store.getters['productSets/getData']
    },
  },
  methods: {
    makeSearch() {
      this.$emit('search', {
        search: this.search,
        set: this.sets,
      })
    },
    clearFilters() {
      this.$emit('search', clone(EMPTY_PRODUCT_FILTERS))
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
