<template>
  <cms-table-row
    class="product-price-list-item"
    :item="product"
    :headers="table.headers"
    no-hover
    el="div"
  >
    <template #name>
      <div class="product-price-list-item__name">
        <b>{{ product.product_name }}</b>
        <icon-button
          size="small"
          type="primary"
          :to="`/products/${product.product_id}`"
          target="_blank"
        >
          <template #icon> <i class="bx bx-link-external"></i> </template>
        </icon-button>
      </div>
    </template>

    <template #price>
      <ProductPriceForm
        :product="product"
        :price-map-id="priceMapId"
        @update="$emit('update', $event)"
      />
    </template>
  </cms-table-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PriceMapPrice } from '@heseya/store-core'

import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import ProductPriceForm from './ProductPriceForm.vue'

import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  components: { CmsTableRow, ProductPriceForm },
  props: {
    product: {
      type: Object as PropType<PriceMapPrice>,
      required: true,
    },
    priceMapId: {
      type: String,
      required: true,
    },
    table: {
      type: Object as PropType<TableConfig<PriceMapPrice>>,
      required: true,
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
