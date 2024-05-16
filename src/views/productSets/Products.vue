<template>
  <div style="position: relative">
    <TopNav>
      <template #title>
        <span class="gray-text">{{ $t('title') }}&nbsp;</span>"{{ productSet.name }}"
      </template>
      <icon-button reversed @click="togglePublic">
        <template #icon>
          <i class="bx bx-low-vision"></i>
        </template>
        {{ showOnlyPublic ? $t('showAll') : $t('showOnlyPublic') }}
      </icon-button>
    </TopNav>

    <Loading :active="isLoading" />

    <Card ref="table">
      <CmsTable
        v-if="products.length"
        :config="tableConfig"
        draggable
        :value="products"
        no-hover
        @reorder="handleReorder"
      >
        <template #item="{ item: product }">
          <ProductListItem
            :key="product.id"
            :product="product"
            :table="tableConfig"
            draggable
            static
          />
        </template>
      </CmsTable>
      <Empty v-else>{{ $t('empty') }}</Empty>

      <AppButton
        v-if="canLoadMore"
        :loading="isLoading"
        class="load-more-btn"
        type="primary"
        @click="fetchProducts"
      >
        {{ $t('loadMoreButton') }}
      </AppButton>
    </Card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Produkty w kolekcji",
    "empty": "Brak produktów w kolekcji",
    "loadMoreButton": "Załaduj więcej produktów",
    "showOnlyPublic": "Pokaż tylko publiczne produkty",
    "showAll": "Pokaż wszystkie produkty"
  },
  "en": {
    "title": "Products in collection",
    "empty": "No products in collection",
    "loadMoreButton": "Load more products",
    "showOnlyPublic": "Show only public products",
    "showAll": "Show all products"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ProductSet, ProductList } from '@heseya/store-core'

import { UUID } from '@/interfaces/UUID'

import { formatApiNotificationError } from '@/utils/errors'
import { sdk } from '@/api'
import { FEATURE_FLAGS } from '@/consts/featureFlags'

import TopNav from '@/components/layout/TopNav.vue'
import Empty from '@/components/layout/Empty.vue'
import Loading from '@/components/layout/Loading.vue'
import CmsTable from '@/components/cms/CmsTable.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import ProductListItem from '@/components/modules/products/ProductListItem.vue'
import Card from '@/components/layout/Card.vue'
import { HeseyaPaginationMeta } from '@heseya/store-core'
import AppButton from '@/components/layout/AppButton.vue'

export default defineComponent({
  components: {
    TopNav,
    Empty,
    Loading,
    CmsTable,
    ProductListItem,
    Card,
    AppButton,
  },
  metaInfo(this: any): any {
    return {
      title: `${this.$t('title')} ${this.productSet?.name || ''}`,
    }
  },
  data: () => ({
    products: [] as ProductList[],
    pagination: { currentPage: 0, lastPage: Infinity } as HeseyaPaginationMeta,
    isLoading: false,
    showOnlyPublic: true,
  }),
  computed: {
    id(): UUID {
      return this.$route.params.id
    },
    productSet(): ProductSet {
      return this.$accessor.productSets.getSelected || ({} as any)
    },
    error(): any {
      return this.$accessor.productSets.getError
    },
    objectFit(): 'contain' | 'cover' {
      return +this.$accessor.config.env[FEATURE_FLAGS.ProductContain] ? 'contain' : 'cover'
    },

    canLoadMore(): boolean {
      return (
        this.pagination.currentPage + 1 <= this.pagination.lastPage &&
        this.pagination.currentPage !== 0
      )
    },

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

    tableConfig(): TableConfig<ProductList> {
      return {
        headers: [
          { key: 'cover', label: '', width: '60px' },
          { key: 'name', label: this.$t('common.form.name').toString() },
          {
            key: 'price',
            label: this.priceLabel,
            width: '0.6fr',

            sortKey: () => `price:${this.$accessor.config.currency}`,
          },
          {
            key: 'public',
            label: this.$t('common.visible').toString(),
            width: '0.4fr',
          },
          {
            key: 'available',
            label: this.$t('common.available').toString(),
            width: '0.4fr',
          },
        ],
      }
    },
  },
  watch: {
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },

  async created() {
    await this.init()
  },

  methods: {
    init() {
      this.pagination = { currentPage: 0, lastPage: Infinity } as HeseyaPaginationMeta
      this.products = []
      return Promise.all([this.$accessor.productSets.get(this.id), this.fetchProducts()])
    },

    async fetchProducts() {
      if (this.pagination.currentPage + 1 > this.pagination.lastPage) return

      this.isLoading = true
      try {
        const response = await sdk.ProductSets.getAllProducts(this.id, {
          page: this.pagination.currentPage + 1,
          // TODO: lazy load after scroll
          limit: 500,
          public: this.showOnlyPublic ? true : undefined,
        })
        this.products = [...this.products, ...response.data]
        this.pagination = response.pagination
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.isLoading = false
    },

    async handleReorder(moved: { element: ProductList; newIndex: number; oldIndex: number }) {
      if (!this.productSet) return
      this.isLoading = true
      try {
        await sdk.ProductSets.reorderProducts(this.productSet.id, [
          { id: moved.element.id, order: moved.newIndex },
        ])
        // Move element in local array to the new index
        this.products.splice(moved.newIndex, 0, this.products.splice(moved.oldIndex, 1)[0])
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.isLoading = false
    },

    async togglePublic() {
      this.showOnlyPublic = !this.showOnlyPublic
      this.isLoading = true
      await this.init()
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.load-more-btn {
  margin: 16px auto 8px;
}
</style>
