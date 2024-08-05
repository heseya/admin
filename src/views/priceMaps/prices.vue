<template>
  <div class="price-map-prices">
    <ProductPricesList
      :title="`${$t('title')} ${priceMap ? priceMap.name : ''}`"
      :filters="filters"
      :table="tableConfig"
      :price-map-id="id"
      store-key="products"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <ProductsFilter :filters="filters" @search="makeSearch" />
      </template>
    </ProductPricesList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Cennik:"
  },
  "en": {
    "title": "Price map:"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { Product, PriceMapListed } from '@heseya/store-core'

import ProductPricesList from '@/components/modules/priceMaps/ProductPricesList.vue'
import ProductsFilter, {
  EMPTY_PRODUCT_FILTERS,
  ProductFilters,
} from '@/components/modules/products/ProductsFilter.vue'

import { formatFilters } from '@/utils/utils'
import { parseQueryToProductFilters } from '@/utils/parseQueryToProductFilters'
import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  metaInfo(this: any) {
    return { title: `${this.$t('title')} ${this.priceMap ? this.priceMap.name : ''}` }
  },
  components: {
    ProductsFilter,
    ProductPricesList,
  },

  data: () => ({
    filters: cloneDeep(EMPTY_PRODUCT_FILTERS),
    listView: false,
  }),

  computed: {
    id(): string {
      return this.$route.params.id
    },
    priceMap(): PriceMapListed | null {
      return this.$accessor.priceMaps.selected
    },
    tableConfig(): TableConfig<Product> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name').toString(), width: '1fr' },
          {
            key: 'price',
            label: this.$t('common.price').toString(),
            width: '2fr',
          },
        ],
      }
    },
  },

  async created() {
    this.filters = parseQueryToProductFilters(this.$route.query)

    this.$accessor.startLoading()
    await this.$accessor.priceMaps.get(this.id)
    this.$accessor.stopLoading()
  },
  methods: {
    makeSearch(filters: ProductFilters) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: `/settings/price-maps/${this.id}/prices`,
        query: { ...queryFilters, page: undefined },
      })
    },
    clearFilters() {
      this.makeSearch(cloneDeep(EMPTY_PRODUCT_FILTERS))
    },
  },
})
</script>

<style lang="scss">
.price-map-prices {
}
</style>
