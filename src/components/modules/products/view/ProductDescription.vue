<template>
  <a-collapse accordion :bordered="false" class="product-advanced-details">
    <template #expandIcon="{ isActive }">
      <div>
        <i :class="`bx ${isActive ? 'bx-chevron-up' : 'bx-chevron-down'}`"></i>
      </div>
    </template>

    <a-collapse-panel>
      <template #header>
        <span class="seo-form-accordion__title">{{ $t('title') }}</span>
      </template>

      <rich-editor v-if="!loading" v-model="form.description_html" :disabled="disabled" />
    </a-collapse-panel>
  </a-collapse>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Pełen opis"
  },
  "en": {
    "title": "Full description"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'

import RichEditor from '@/components/form/RichEditor.vue'

export default Vue.extend({
  components: { RichEditor },
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
    loading: { type: Boolean, default: false },
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
