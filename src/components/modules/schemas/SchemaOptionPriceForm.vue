<template>
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
</template>

<i18n lang="json">
{}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Schema, PriceMapSchemaPrice } from '@heseya/store-core'

export interface PriceMapSchemaOptionPrice extends Omit<PriceMapSchemaPrice, 'options'> {
  price: string
}

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<PriceMapSchemaOptionPrice[]>,
      required: true,
    },
    schema: {
      type: Object as PropType<Schema>,
      default: () => ({} as Schema),
    },
    disabled: { type: Boolean, default: false },
  },

  computed: {
    form: {
      get(): PriceMapSchemaOptionPrice[] {
        return this.value
      },
      set(value: PriceMapSchemaOptionPrice[]) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style lang="scss">
.product-price-form {
  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  &__input {
    width: 150px;
  }

  &__label {
    color: $gray-color-600;
    font-size: 0.9em;
    flex-shrink: 0;

    &--black {
      color: $gray-color-900;
    }
  }
}
</style>
