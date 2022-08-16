<template>
  <div class="product-visibility-switch">
    <switch-input v-model="form.public" horizontal :disabled="disabled" :label="$t('isPublic')">
      <template #unCheckedChildren> <i class="bx bxs-low-vision"></i> </template>
      <template #checkedChildren> <i class="bx bx-show"></i> </template>
    </switch-input>
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

<i18n>
{
  "pl": {
    "isPublic": "Widoczność produktu",
    "stillVisible": {
      "title": "Produkt wciąż jest ukryty",
      "description": "Produkt jest niewidoczny ponieważ jego marka lub kategoria jest ukryta."
    }
  },
  "en": {
    "isPublic": "Product visibility",
    "stillVisible": {
      "title": "Product is still hidden",
      "description": "Product is hidden because its brand or category is hidden."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'

export default Vue.extend({
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
