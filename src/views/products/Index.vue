<template>
  <div class="products-container" :class="{ 'products-container--grid-view': !listView }">
    <PaginatedList
      :title="$t('title')"
      :filters="filters"
      store-key="products"
      :table="listView ? tableConfig : undefined"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button @click="listView = !listView">
          <template #icon>
            <i v-if="!listView" class="bx bx-list-ul"></i>
            <i v-else class="bx bx-grid"></i>
          </template>
          {{ $t('view.message') }} {{ listView ? $t('view.grid') : $t('view.list') }}
        </icon-button>

        <icon-button to="/products/create" data-cy="add-btn">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <products-filter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: product }">
        <ProductTile v-if="!listView" :key="product.id" :product="product" />
        <ProductListItem v-else :key="product.id" :product="product" :table="tableConfig" />
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Asortyment",
    "add": "Dodaj produkt",
    "view": {
      "message": "Przełącz na widok",
      "grid": "siatki",
      "list": "listy"
    },
    "form": {
      "price": "Cena",
      "tags": "Tagi",
      "public": "Widoczność"
    }
  },
  "en": {
    "title": "Products",
    "add": "Add product",
    "view": {
      "message": "Switch to view",
      "grid": "grid",
      "list": "list"
    },
    "form": {
      "price": "Price",
      "tags": "Tags",
      "public": "Visibility"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import ProductTile from '@/components/modules/products/ProductTile.vue'
import ProductListItem from '@/components/modules/products/ProductListItem.vue'
import ProductsFilter, {
  EMPTY_PRODUCT_FILTERS,
} from '@/components/modules/products/ProductsFilter.vue'
import PaginatedList from '@/components/PaginatedList.vue'

import { formatFilters } from '@/utils/utils'
import { ALL_FILTER_VALUE } from '@/consts/filters'
import { TableConfig } from '@/interfaces/CmsTable'
import { Product } from '@/interfaces/Product'

const LOCAL_STORAGE_KEY = 'products-list-view'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ProductTile,
    ProductsFilter,
    PaginatedList,
    ProductListItem,
  },
  data: () => ({
    filters: { ...EMPTY_PRODUCT_FILTERS },
    listView: false,
  }),
  computed: {
    tableConfig(): TableConfig<Product> {
      return {
        headers: [
          { key: 'cover', label: '', width: '60px' },
          { key: 'name', label: this.$t('common.form.name') as string, sortable: true },
          { key: 'price', label: this.$t('form.price') as string, width: '0.5fr', sortable: true },
          { key: 'tags', label: this.$t('form.tags') as string },
          {
            key: 'public',
            label: this.$t('form.public') as string,
            width: '0.5fr',
            sortable: true,
          },
        ],
      }
    },
  },
  watch: {
    listView(listView: boolean) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, String(Number(listView)))
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    const sets = this.$route.query.sets || [ALL_FILTER_VALUE]
    this.filters.sets = Array.isArray(sets) ? (sets as string[]) : [sets]
    const tags = this.$route.query.tags || [ALL_FILTER_VALUE]
    this.filters.tags = Array.isArray(tags) ? (tags as string[]) : [tags]

    this.filters.public = (this.$route.query.public as string) || ALL_FILTER_VALUE
    this.filters.sort = (this.$route.query.sort as string) || ''

    this.listView = !!+(window.localStorage.getItem(LOCAL_STORAGE_KEY) || 0)
  },
  methods: {
    makeSearch(filters: typeof EMPTY_PRODUCT_FILTERS) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'products',
        query: { page: undefined, ...queryFilters },
      })
    },
    clearFilters() {
      this.makeSearch({ ...EMPTY_PRODUCT_FILTERS })
    },
  },
})
</script>

<style lang="scss">
.products-container {
  &--grid-view {
    .paginated-list__content {
      padding: 0;
      background-color: #ffffff00;
      box-shadow: none;
      border: none;
    }

    .paginated-list__list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      grid-gap: 22px;
      padding: 0;
      min-height: 100px;
      margin-bottom: 12px;
      align-items: start;

      @media ($viewport-6) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      }

      @media ($viewport-10) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  }
}
</style>
