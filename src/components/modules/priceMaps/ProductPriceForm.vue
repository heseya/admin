<template>
  <div class="product-price-form">
    <div class="product-price-form__row">
      <span class="product-price-form__label">{{ 'Cena bazowa' }}</span>
      <app-input type="number" class="product-price-form__input" :disabled="false" />
    </div>

    <div class="product-price-form__row">
      <span class="product-price-form__label">{{ 'Schemat 1' }}</span>
      <span class="product-price-form__label product-price-form__label--black">{{
        'Opcja 1'
      }}</span>
      <app-input type="number" class="product-price-form__input" :disabled="false" />
      <span class="product-price-form__label product-price-form__label--black">{{
        'Opcja 2'
      }}</span>
      <app-input type="number" class="product-price-form__input" :disabled="false" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@heseya/store-core'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
})
</script>

<style lang="scss">
.product-price-form {
  &__row {
    display: flex;
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
