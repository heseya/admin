<template>
  <LayoutAccordion class="product-prices">
    <template #title>
      <div class="product-prices__title">
        <span>{{ $t('title') }}</span>

        <icon-button target="_blank" to="/settings/price-maps" size="small">
          <template #icon>
            <i class="bx bx-link-external"></i>
          </template>
          {{ $t('goToPriceMaps') }}
        </icon-button>
      </div>
    </template>

    <div class="product-prices__form">
      <validated-input
        v-for="price in form"
        :key="price.id"
        v-model="price.price"
        type="number"
        step="0.01"
        :label="`${price.price_map_name} - ${price.currency} (${$t(
          price.is_net ? 'common.net' : 'common.gross',
        )
          .toString()
          .toLowerCase()})`"
        :name="`${price.price_map_id}_${price.currency}`"
        :disabled="disabled"
        :precision="2"
      />
    </div>
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Ceny we wszystkich cennikach",
    "goToPriceMaps": "Przejdź do cenników"
  },
  "en": {
    "title": "Prices in all price lists",
    "goToPriceMaps": "Go to price lists"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product, PriceMapProductPrice } from '@heseya/store-core'

import LayoutAccordion from '@/components/layout/Accordion.vue'

export default defineComponent({
  components: { LayoutAccordion },
  props: {
    value: {
      type: Array as PropType<PriceMapProductPrice[]>,
      required: true,
    },
    product: {
      type: Object as PropType<Product>,
      default: () => ({} as Product),
    },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    form: {
      get(): PriceMapProductPrice[] {
        return this.value
      },
      set(value: PriceMapProductPrice[]) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.product-prices {
  &__title {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  &__form {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0 12px;

    @media ($viewport-6) {
      grid-template-columns: 1fr 1fr;
    }

    @media ($viewport-9) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
}
</style>
