<template>
  <div style="position: relative">
    <TopNav>
      <template #title>
        <span class="gray-text">{{ $t('title') }}&nbsp;</span>"{{ productSet.name }}"
      </template>
    </TopNav>

    <Loading :active="isLoading" />

    <div v-if="products.length" class="set-products-list">
      <draggable
        :value="products"
        :disabled="!$can($p.ProductSets.Edit)"
        @change="reorderSetProducts"
      >
        <div v-for="product in products" :key="product.id" class="set-product-item">
          <Avatar color="#eee">
            <img
              v-if="product.cover"
              :src="`${product.cover.url}?w=100&h=100`"
              :style="{ objectFit }"
            />
            <i v-else class="product-list-item__img-icon bx bx-image"></i>
          </Avatar>
          <div class="set-product-item__main">
            <div class="set-product-item__row">
              <div>
                <span class="set-product-item__name">{{ product.name }}</span>
                <ProductPrice tag="span" class="set-product-item__price" :product="product" />
              </div>
              <BooleanTag
                :value="product.public"
                class="product-list-item__public"
                small
                true-icon="bx bx-show-alt"
                false-icon="bx bx-low-vision"
                :true-text="$t('common.visible').toString()"
                :false-text="$t('common.hidden').toString()"
              />
            </div>
          </div>
        </div>
      </draggable>
    </div>

    <Empty v-else>{{ $t('empty') }}</Empty>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Produkty w kolekcji",
    "empty": "Brak produktów w kolekcji"
  },
  "en": {
    "title": "Products in collection",
    "empty": "No products in collection"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ProductSet, ProductList } from '@heseya/store-core'
import Draggable from 'vuedraggable'

import TopNav from '@/components/layout/TopNav.vue'

import { UUID } from '@/interfaces/UUID'

import { formatApiNotificationError } from '@/utils/errors'
import { sdk } from '@/api'
import { FEATURE_FLAGS } from '@/consts/featureFlags'
import Avatar from '@/components/layout/Avatar.vue'
import BooleanTag from '@/components/layout/BooleanTag.vue'
import ProductPrice from '@/components/modules/products/ProductPrice.vue'
import Empty from '@/components/layout/Empty.vue'
import Loading from '@/components/layout/Loading.vue'

export default defineComponent({
  components: {
    TopNav,
    Draggable,
    Avatar,
    BooleanTag,
    ProductPrice,
    Empty,
    Loading,
  },
  metaInfo(this: any): any {
    return {
      title: `${this.$t('title')} ${this.productSet?.name || ''}`,
    }
  },
  data: () => ({
    products: [] as ProductList[],
    isLoading: false,
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
  },
  watch: {
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },

  async created() {
    this.isLoading = true
    await Promise.all([this.$accessor.productSets.get(this.id), this.fetchProducts()])
    this.isLoading = false
  },

  methods: {
    async fetchProducts() {
      const products = await sdk.ProductSets.getAllProducts(this.id, { limit: 500 })
      this.products = products.data
    },

    async reorderSetProducts({
      moved,
    }: {
      moved: { element: ProductList; newIndex: number; oldIndex: number }
    }) {
      if (!this.productSet) return
      try {
        await sdk.ProductSets.reorderProducts(this.productSet.id, [
          { id: moved.element.id, order: moved.newIndex },
        ])
        // Move element in local array to the new index
        this.products.splice(moved.newIndex, 0, this.products.splice(moved.oldIndex, 1)[0])
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.set-products-list {
}

.set-product-item {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  transition: 0.3s;
  cursor: move;

  @media (pointer: fine) {
    &:hover {
      background-color: var(--background-color-500);
    }
  }
  &__main {
    margin-left: 8px;
  }

  &__name {
    display: block;
    font-weight: 600;
  }

  &__price {
    display: block;
    font-size: 0.8em;
  }

  &__actions {
    margin-left: auto;
    position: relative;
    z-index: 100;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
