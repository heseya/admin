<template>
  <div class="product-prices-list" :class="{ 'product-prices-list--table': !!table }">
    <AppTopNav :subtitle="subtitle">
      <template #title>
        <slot name="title">{{ title }}</slot>
      </template>

      <slot name="nav"></slot>
    </AppTopNav>

    <AppCmsFilters
      v-show="$slots.filters"
      :filters="filters"
      @clear-filters="$emit('clear-filters')"
    >
      <slot name="filters"></slot>
    </AppCmsFilters>

    <AppCard class="product-prices-list__content">
      <Loading :active="isLoading"></Loading>

      <AppEmpty v-if="!items.length || isLoading">
        {{ emptyText || $t('common.defaultEmpty') }}
      </AppEmpty>
      <component
        :is="contentComponent"
        v-else
        v-model="items"
        :sort-filters="filters && filters.sort"
        v-bind="!!table ? { config: table } : {}"
        class="product-prices-list__list"
        @sort="onSort"
      >
        <div v-for="item in items" :key="item.id" class="product-prices-list__list-item">
          <ProductPriceListItem
            :key="item.id"
            :product-price="item"
            :price-map-id="priceMapId"
            :table="table"
            @update="handlePriceUpdate"
          />
        </div>
      </component>
    </AppCard>

    <div v-if="meta.lastPage" class="product-prices-list__footer">
      <AppPagination :value="page" :length="meta.lastPage" @input="changePage" />
      <AppPerPageSelect :value="itemsPerPage" @input="changePerPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { HeseyaPaginationMeta, PriceMapPrice } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Empty from '@/components/layout/Empty.vue'
import Pagination from '@/components/cms/Pagination.vue'
import Card from '@/components/layout/Card.vue'
import PerPageSelect from '@/components/cms/PerPageSelect.vue'
import CmsFilters from '@/components/cms/CmsFilters.vue'
import CmsTable from '@/components/cms/CmsTable.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import Loading from '@/components/layout/Loading.vue'
import ProductPriceListItem from '@/components/modules/priceMaps/ProductPriceListItem.vue'

import { TableConfig } from '@/interfaces/CmsTable'

import { formatFilters } from '@/utils/utils'
import { formatApiNotificationError } from '@/utils/errors'
import { sdk } from '@/api'

export default defineComponent({
  components: {
    AppTopNav: TopNav,
    AppEmpty: Empty,
    AppPagination: Pagination,
    AppCard: Card,
    AppPerPageSelect: PerPageSelect,
    AppCmsFilters: CmsFilters,
    Loading,
    CmsTable,
    CmsTableRow,
    ProductPriceListItem,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    priceMapId: {
      type: String,
      required: true,
    },
    emptyText: {
      type: String,
      default: null,
    },
    filters: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    table: {
      type: Object as PropType<TableConfig<any>>,
      default: null,
    },
    params: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  data: () => ({
    page: 1,
    isLoading: false,
    itemsPerPage: 24,
    items: [] as PriceMapPrice[],
    meta: {} as HeseyaPaginationMeta,
    error: null,
  }),
  computed: {
    contentComponent(): string {
      if (this.table) return 'CmsTable'
      return 'div'
    },
  },
  watch: {
    '$route.query'({ page }) {
      this.page = Number(page) || 1
      if (this.meta.currentPage !== page) {
        window.scrollTo(0, 0)
      }
      this.getItems()
    },
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  beforeMount() {
    this.page = Number(this.$route.query.page) || 1
    this.itemsPerPage = +(localStorage.getItem(`price_map_prices_per_page`) || 24)
  },
  mounted() {
    this.getItems()
  },

  methods: {
    changePage(page: number) {
      if (this.page !== page) {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, page: String(page) },
        })
      }
    },
    changePerPage(perPage: number) {
      this.itemsPerPage = perPage
      localStorage.setItem(`price_map_prices_per_page`, String(perPage))

      if (this.page === 1) this.getItems()
      else this.$router.push({ path: this.$route.path, query: { ...this.$route.query, page: '1' } })
    },
    onSort(sortFilters: string) {
      this.$emit('search', { ...this.filters, sort: sortFilters })
    },
    async getItems() {
      this.isLoading = true
      try {
        const queryFilters = formatFilters(this.filters)
        const data = await sdk.PriceMaps.getPrices(this.priceMapId, {
          ...queryFilters,
          page: this.page,
          limit: this.itemsPerPage,
          ...this.params,
        })
        this.items = data.data
        this.meta = data.pagination
      } catch (e: any) {
        this.error = e

        // TODO: remove mock
        if (!this.items.length)
          this.items = Array.from(
            { length: 10 },
            (): PriceMapPrice => ({
              id: Math.random().toString().replace('0.', ''),
              product_id: Math.random().toString().replace('0.', ''),
              product_name: 'Product Name',
              product_price: '222',
              schema_options: [
                {
                  schema_id: 'uuid1',
                  schema_option_id: Math.random().toString().replace('0.', ''),
                  schema_name: 'Schemat 1',
                  schema_option_name: 'Opcja 1',
                  schema_option_price: '223',
                },
                {
                  schema_id: 'uuid1',
                  schema_option_id: Math.random().toString().replace('0.', ''),
                  schema_name: 'Schemat 1',
                  schema_option_name: 'Opcja 2',
                  schema_option_price: '3423',
                },
                {
                  schema_id: 'uuid2',
                  schema_option_id: Math.random().toString().replace('0.', ''),
                  schema_name: 'Schemat 2',
                  schema_option_name: 'Opcja 1',
                  schema_option_price: '45',
                },
              ],
            }),
          )
      }

      this.isLoading = false
    },

    handlePriceUpdate(product: PriceMapPrice) {
      this.items = this.items.map((item) =>
        item.product_id === product.product_id ? product : item,
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.product-prices-list {
  position: relative;

  &__list {
    padding: 0;
  }

  &__list-item {
    width: 100%;

    @media ($viewport-11) {
      &:not(:last-of-type) .cms-table-row {
        border-bottom: solid 1px var(--background-color-700) !important;
      }
    }
  }

  &__content {
    position: relative;
  }

  &__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-direction: column;

    > * {
      margin-top: 8px;
    }

    @media ($viewport-6) {
      flex-direction: row;

      > * {
        margin-top: 0;
      }
    }
  }

  &--table &__content {
    padding: 0;

    @media ($max-viewport-11) {
      all: unset;
    }
  }
}
</style>
