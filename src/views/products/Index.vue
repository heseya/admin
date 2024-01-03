<template>
  <div class="products-container" :class="{ 'products-container--grid-view': !listView }">
    <PaginatedList
      :title="$t('title').toString()"
      :filters="filters"
      store-key="products"
      :table="listView ? tableConfig : undefined"
      :xlsx-file-config="fileConfig"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <UpdatePriceButton v-if="$accessor.config.env.show_import_prices_btn === '1'" />

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

<i18n lang="json">
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
      "tags": "Tagi",
      "shippingDigital": "Wysyłka cyfrowa"
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
      "tags": "Tags",
      "shippingDigital": "Digital shipping"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash'
import { Product, Tag } from '@heseya/store-core'

import ProductTile from '@/components/modules/products/ProductTile.vue'
import ProductListItem from '@/components/modules/products/ProductListItem.vue'
import ProductsFilter, {
  EMPTY_PRODUCT_FILTERS,
  ProductFilers,
} from '@/components/modules/products/ProductsFilter.vue'
import PaginatedList from '@/components/PaginatedList.vue'

import { formatFilters } from '@/utils/utils'
import { TableConfig } from '@/interfaces/CmsTable'
import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'
import UpdatePriceButton from '@/components/modules/products/UpdatePriceButton.vue'

const LOCAL_STORAGE_KEY = 'products-list-view'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title').toString() }
  },
  components: {
    ProductTile,
    ProductsFilter,
    PaginatedList,
    ProductListItem,
    UpdatePriceButton,
  },

  beforeRouteLeave(to, _from, next) {
    // @ts-ignore
    if (window.copyIdMode && to.name === 'ProductsView') {
      navigator.clipboard.writeText(to.params.id).then(() => {
        this.$toast.success('Skopiowano ID')
      })
      return next(false)
    }
    return next()
  },

  data: () => ({
    filters: cloneDeep(EMPTY_PRODUCT_FILTERS),
    listView: false,
  }),

  computed: {
    /**
     * If all sales channels have a VAT rate equal to 0, we can surlly assume that all prices are gross.
     */
    priceLabel(): string {
      return `${this.$t('common.price')} ${this.$t(
        this.$accessor.config.allPricesGross ? 'common.gross' : 'common.net',
      )
        .toString()
        .toLowerCase()}`
    },

    tableConfig(): TableConfig<Product> {
      return {
        headers: [
          { key: 'cover', label: '', width: '60px' },
          { key: 'name', label: this.$t('common.form.name').toString(), sortable: true },
          { key: 'tags', label: this.$t('form.tags').toString(), width: '0.6fr' },
          {
            key: 'price',
            label: this.priceLabel,
            width: '0.6fr',
            sortable: true,
            sortKey: () => `price:${this.$accessor.config.currency}`,
          },
          {
            key: 'public',
            label: this.$t('form.public').toString(),
            width: '0.4fr',
            sortable: true,
          },
          {
            key: 'available',
            label: this.$t('common.available').toString(),
            width: '0.4fr',
          },
          {
            key: 'shipping_digital',
            label: this.$t('form.shippingDigital').toString(),
            width: '0.4fr',
          },
          { key: 'action', label: '', width: '64px' },
        ],
      }
    },
    fileConfig(): XlsxFileConfig<Product> {
      return {
        name: this.$t('title').toString(),
        headers: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: this.$t('common.form.name').toString() },
          { key: 'price' as any, label: this.priceLabel },
          {
            key: 'tags',
            label: this.$t('form.tags').toString(),
            format: (v: Tag[]) => v.map((tag) => tag.name).join(', '),
          },
          {
            key: 'public',
            label: this.$t('common.visible').toString(),
            format: (v: boolean) => (v ? this.$t('common.yes') : this.$t('common.no')).toString(),
          },

          {
            key: 'available',
            label: this.$t('form.available').toString(),
            format: (v: boolean) => (v ? this.$t('common.yes') : this.$t('common.no')).toString(),
          },
          {
            key: 'shipping_digital',
            label: this.$t('form.shippingDigital').toString(),
            format: (v: boolean) => (v ? this.$t('common.yes') : this.$t('common.no')).toString(),
          },
        ],
      }
    },
  },

  watch: {
    listView(listView: boolean) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, String(Number(listView)))
    },

    '$accessor.config.currency'() {
      // Removes products sort key when currency changes
      this.filters.sort = this.filters.sort
        ?.split(',')
        .filter((s) => !s.startsWith('price:'))
        .join(',')
    },
  },

  mounted() {
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName })
  },

  created() {
    Object.entries(this.$route.query).forEach(([key, value]) => {
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

    this.listView = !!+(window.localStorage.getItem(LOCAL_STORAGE_KEY) || 0)
  },
  methods: {
    makeSearch(filters: ProductFilers) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'products',
        query: { page: undefined, ...queryFilters },
      })
    },
    clearFilters() {
      this.makeSearch(cloneDeep(EMPTY_PRODUCT_FILTERS))
    },
  },
})
</script>

<style lang="scss">
.products-container {
  &--grid-view {
    .paginated-list__content {
      padding: 0;
      background-color: $transparent;
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
