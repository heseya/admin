<template>
  <a-modal width="900px" class="set-products" :visible="isOpen" @cancel="$emit('close')">
    <template #title>
      <div class="set-products__header">
        <h4>{{ $t('title') }} "{{ set && set.name }}"</h4>

        <icon-button v-can="$p.ProductSets.Edit" size="small" dark @click="isSelectorActive = true">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('addProduct') }}
        </icon-button>
      </div>
    </template>

    <p v-if="set">
      {{ $t('description') }}
      <router-link :to="`/collections/${set.id}/products`">{{ $t('clickHere') }}</router-link>
    </p>

    <div v-if="products.length" class="set-products__list">
      <div v-for="product in products" :key="product.id" class="set-product-item">
        <avatar color="#eee">
          <img
            v-if="product.cover"
            :src="`${product.cover.url}?w=100&h=100`"
            :style="{ objectFit }"
          />
          <i v-else class="product-list-item__img-icon bx bx-image"></i>
        </avatar>
        <div class="set-product-item__main">
          <div class="set-product-item__row">
            <div>
              <span class="set-product-item__name">{{ product.name }}</span>
              <product-price tag="span" class="set-product-item__price" :product="product" />
            </div>
            <boolean-tag
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
        <div class="set-product-item__actions undragabble">
          <icon-button
            v-can="$p.ProductSets.Edit"
            size="small"
            type="danger"
            @click.stop="removeProduct(product.id)"
          >
            <template #icon>
              <i class="bx bx-trash"></i>
            </template>
          </icon-button>
        </div>
      </div>
    </div>

    <empty v-else>{{ $t('empty') }}</empty>

    <template #footer>
      <app-button type="success" @click="save">{{ $t('common.save') }}</app-button>
    </template>

    <a-modal
      v-model="isSelectorActive"
      width="800px"
      :title="$t('chooseProduct').toString()"
      :footer="null"
    >
      <selector
        v-if="isSelectorActive"
        :type-name="$t('product').toString()"
        type="products"
        :existing="products"
        @select="addProduct"
      />
    </a-modal>
  </a-modal>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Produkty w kolekcji",
    "description": "Widoczne tutaj produkty są produktami bezpośrednio powiazanymi z kolekcją. Lista nie obejmuje produktów, które są w kolekcji z powodu przynależności do jednej lub wielu kolekcji-dzieci tej kolekcji. W związku z tym nie ma możliwości zmiany kolejności produktów w tym miejscu, aby to zrobić ",
    "clickHere": "przejdź tutaj.",
    "addProduct": "Dodaj produkt do kolekcji",
    "empty": "Ta kolekcja nie zawiera produktów.",
    "chooseProduct": "Wybierz produkt",
    "successMessage": "Produkty zostały zapisane w kolekcji",
    "product": "produkt"
  },
  "en": {
    "title": "Products in collection",
    "description": "The products visible here are products directly associated with the collection. The list does not include products that are in the collection because they belong to one or more child collections of this collection. Therefore, it is not possible to change the order of products here, to do this ",
    "clickHere": "go here.",
    "addProduct": "Add product to collection",
    "empty": "This collection does not contain products.",
    "chooseProduct": "Choose product",
    "successMessage": "Products saved in collection",
    "product": "product"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProductListed, ProductSet } from '@heseya/store-core'

import Selector from '@/components/Selector.vue'
import Empty from '@/components/layout/Empty.vue'
import Avatar from '@/components/layout/Avatar.vue'
import ProductPrice from '@/components/modules/products/ProductPrice.vue'

import { UUID } from '@/interfaces/UUID'

import { sdk } from '@/api'
import { formatCurrency } from '@/utils/currency'
import { formatApiNotificationError } from '@/utils/errors'

import { FEATURE_FLAGS } from '@/consts/featureFlags'
import BooleanTag from '@/components/layout/BooleanTag.vue'
import { ProductSetListed } from '@heseya/store-core'

export default defineComponent({
  components: { Selector, Empty, Avatar, ProductPrice, BooleanTag },
  props: {
    set: {
      type: Object as PropType<ProductSetListed | null>,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isSelectorActive: false,
    products: [] as (ProductListed & { unsaved?: true })[],
  }),
  computed: {
    objectFit(): 'contain' | 'cover' {
      return +this.$accessor.config.env[FEATURE_FLAGS.ProductContain] ? 'contain' : 'cover'
    },
  },
  watch: {
    set(v: ProductSet | null) {
      if (v) this.fetchProducts()
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
    },
    addProduct(product: ProductListed) {
      this.products.push({ ...product, unsaved: true })
    },
    removeProduct(productId: UUID) {
      this.products = this.products.filter((product) => product.id !== productId)
    },

    async fetchProducts() {
      if (!this.set) return
      this.$accessor.startLoading()

      // TODO: this could be bad for performance, but it cannot be done any other way
      try {
        let page = 1
        let lastPage = 1
        this.products = []

        do {
          const { data: products, pagination } = await sdk.ProductSets.getProducts(this.set.id, {
            limit: 100,
            page,
          })
          this.products.push(...products)
          page++
          lastPage = pagination.lastPage
        } while (page <= lastPage)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
    },

    async save() {
      if (!this.set) return
      this.$accessor.startLoading()
      try {
        const products = this.products.map((p) => p.id)
        await sdk.ProductSets.updateProducts(this.set.id, products)
        this.$toast.success(this.$t('successMessage') as string)
        this.$emit('close')
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.set-products {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    @media ($viewport-10) {
      flex-direction: row;
      padding-right: 24px;
    }

    h4 {
      margin-bottom: 0;
      margin-right: auto;
    }

    :deep(.icon-button) {
      margin-left: auto;
    }
  }

  &__list {
    overflow: auto;
    max-height: 60vh;
  }
}

.set-product-item {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  transition: 0.3s;

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
