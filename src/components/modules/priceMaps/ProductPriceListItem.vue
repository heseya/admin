<template>
  <cms-table-row
    class="product-price-list-item"
    :item="productPrice"
    :headers="table.headers"
    no-hover
    el="div"
  >
    <template #name>
      <div class="product-price-list-item__name">
        <b>{{ productPrice.product_name }}</b>
      </div>
    </template>

    <template #price>
      <ProductPriceForm
        :product-price="productPrice"
        :price-map-id="priceMapId"
        @update="$emit('update', $event)"
      />
    </template>

    <template #action>
      <a-dropdown v-can.any="[$p.ProductSets.ShowDetails, $p.ProductSets.Add]" :trigger="['click']">
        <icon-button type="transparent" size="big" @click.stop>
          <template #icon>
            <i class="bx bx-dots-vertical-rounded"></i>
          </template>
        </icon-button>

        <template #overlay>
          <a-menu v-can.any="[$p.Products.Edit, $p.Products.Remove]">
            <a-menu-item
              v-can="$p.Products.Edit"
              @click="$router.push(`/products/${productPrice.product_id}`)"
            >
              <i class="bx bx-edit"></i> &nbsp; {{ $t('goToProduct') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </cms-table-row>
</template>

<i18n lang="json">
{
  "pl": {
    "goToProduct": "Przejdź do produktu"
  },
  "en": {
    "goToProduct": "Go to product"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PriceMapPrice } from '@heseya/store-core'

import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import ProductPriceForm from './ProductPriceForm.vue'

import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  components: { CmsTableRow, ProductPriceForm },
  props: {
    productPrice: {
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
