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

      <div class="product-advanced-details__form">
        <tags-select v-model="form.tags" :disabled="disabled" />
        <google-category-select v-model="form.google_product_category" :disabled="disabled" />

        <validated-input v-model="form.order" type="number" name="order" :disabled="disabled">
          <template #label>
            {{ $t('form.order') }}
            <info-tooltip>{{ $t('form.orderTooltip') }}</info-tooltip>
          </template>
        </validated-input>
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>

<i18n>
{
  "pl": {
    "title": "Pozostałe informacje",
    "form": {
      "order": "Priorytet sortowania",
      "orderTooltip": "Pozwala na zmianę kolejności produktów na liście. Produkty z mniejszą liczbą wyświetlane są wyżej."
    }
  },
  "en": {
    "title": "Other information",
    "form": {
      "order": "Sort priority",
      "orderTooltip": "Allows you to change the order of the products in the list. Products with a lower number are displayed higher."
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'

import TagsSelect from '@/components/TagsSelect.vue'
import GoogleCategorySelect from '../GoogleCategorySelect.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import InfoTooltip from '@/components/layout/InfoTooltip.vue'

export default Vue.extend({
  components: { TagsSelect, GoogleCategorySelect, ValidatedInput, InfoTooltip },
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
.product-advanced-details__form {
  width: 100%;

  @media ($viewport-14) {
    width: 75%;
  }
}
</style>
