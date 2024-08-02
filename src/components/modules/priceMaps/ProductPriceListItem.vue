<template>
  <cms-table-row class="product-price-list-item" :item="product" :headers="table.headers" no-hover>
    <template #name>
      <div class="product-price-list-item__name">
        <avatar color="#eee">
          <media-element v-if="product.cover" :media="product.cover" :size="100" />
          <i v-else class="product-price-list-item__img-icon bx bx-image"></i>
        </avatar>
        <b>{{ product.name }}</b>
      </div>
    </template>

    <template #price>
      <ProductPriceForm :product="product" />
    </template>
  </cms-table-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@heseya/store-core'

import Avatar from '@/components/layout/Avatar.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import MediaElement from '@/components/MediaElement.vue'
import ProductPriceForm from './ProductPriceForm.vue'

import { TableConfig } from '@/interfaces/CmsTable'
import { FEATURE_FLAGS } from '@/consts/featureFlags'

export default defineComponent({
  components: { Avatar, CmsTableRow, MediaElement, ProductPriceForm },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
    table: {
      type: Object as PropType<TableConfig<Product>>,
      required: true,
    },
  },
  computed: {
    objectFit(): string {
      return +this.$accessor.config.env[FEATURE_FLAGS.ProductContain] ? 'contain' : 'cover'
    },
  },
})
</script>

<style lang="scss">
.product-price-list-item {
  position: relative;

  &__name {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__img-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    color: var(--gray-color-500);

    &::after {
      content: '';
      display: block;
      width: 120%;
      height: 2px;
      background-color: firebrick;
      position: absolute;
      top: 50%;
      left: -10%;
      transform: rotate(-45deg);
    }
  }
}
</style>
