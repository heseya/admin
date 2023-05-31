<template>
  <div class="product-visibility-switch">
    <div class="product-visibility-switch__input">
      <switch-input v-model="form.public" name="public" :disabled="disabled" />
      <label for="public">{{ form.public ? $t('visible') : $t('notVisible') }}</label>
    </div>
    <template v-if="!product.visible && product.public">
      <br />
      <a-alert
        :message="$t('stillVisible.title')"
        :description="$t('stillVisible.description')"
        show-icon
        type="warning"
      />
    </template>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "visible": "Widoczny",
    "notVisible": "Ukryty",
    "stillVisible": {
      "title": "Produkt wciąż jest ukryty",
      "description": "Produkt jest niewidoczny ponieważ jego marka lub kategoria jest ukryta."
    }
  },
  "en": {
    "visible": "Visible",
    "notVisible": "Hidden",
    "stillVisible": {
      "title": "Product is still hidden",
      "description": "Product is hidden because its brand or category is hidden."
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Product } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'

export default defineComponent({
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductComponentForm>,
    product: {
      type: Object,
      default: () => ({} as Product),
    } as Vue.PropOptions<Product>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    form: {
      get(): ProductComponentForm {
        return this.value
      },
      set(value: ProductComponentForm) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.product-visibility-switch {
  &__input {
    display: flex;
    align-items: center;
    margin: 12px 0;

    label {
      display: block;
      margin-left: 1em;
    }
  }
}
</style>
