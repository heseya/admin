<template>
  <div class="price-map-prices">
    <PaginatedList
      :title="`${$t('title')} ${priceMap ? priceMap.name : ''}`"
      :filters="filters"
      :table="tableConfig"
      store-key="products"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <ProductsFilter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: product }">
        <ProductPriceListItem :key="product.id" :product="product" :table="tableConfig" />
      </template>
    </PaginatedList>
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

import ProductPriceListItem from '@/components/modules/priceMaps/ProductPriceListItem.vue'
import ProductsFilter, {
  EMPTY_PRODUCT_FILTERS,
  ProductFilers,
} from '@/components/modules/products/ProductsFilter.vue'
import PaginatedList from '@/components/PaginatedList.vue'

import { formatFilters } from '@/utils/utils'
import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title').toString() }
  },
  components: {
    ProductsFilter,
    PaginatedList,
    ProductPriceListItem,
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
    Object.entries(this.$route.query).forEach(([key, value]) => {
      if (key === 'page') return
      this.filters[key] = value as any
    })

    const {
      sets,
      tags,
      public: isPublic,
      available,
      has_cover: hasCover,
      has_items: hasItems,
      has_schemas: hasSchemas,
      shipping_digital: shippingDigital,
    } = this.$route.query
    this.filters.sets = (Array.isArray(sets) ? (sets as string[]) : [sets]).filter(Boolean)
    this.filters.tags = (Array.isArray(tags) ? (tags as string[]) : [tags]).filter(Boolean)
    this.filters.public = (isPublic as string) || EMPTY_PRODUCT_FILTERS.public
    this.filters.available = (available as string) || EMPTY_PRODUCT_FILTERS.available
    this.filters.has_cover = (hasCover as string) || EMPTY_PRODUCT_FILTERS.has_cover
    this.filters.has_items = (hasItems as string) || EMPTY_PRODUCT_FILTERS.has_items
    this.filters.has_schemas = (hasSchemas as string) || EMPTY_PRODUCT_FILTERS.has_schemas
    this.filters.shipping_digital =
      (shippingDigital as string) || EMPTY_PRODUCT_FILTERS.shipping_digital

    this.$accessor.startLoading()
    await this.$accessor.priceMaps.get(this.id)
    this.$accessor.stopLoading()
  },
  methods: {
    makeSearch(filters: ProductFilers) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'products',
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
