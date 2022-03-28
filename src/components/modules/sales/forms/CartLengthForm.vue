<template>
  <div class="cart-length-form">
    <validated-input
      v-model="form.min_value"
      :name="`${formId}.min_value`"
      type="number"
      :rules="`not-negative|less-than:@${formId}.max_value`"
      :disabled="disabled"
      :label="$t('form.min_value')"
    />
    <validated-input
      v-model="form.max_value"
      :name="`${formId}.max_value`"
      rules="not-negative"
      type="number"
      :disabled="disabled"
      :label="$t('form.max_value')"
    />
  </div>
</template>

<i18n>
{
  "en": {
    "form": {
      "min_value": "Minimal cart items count",
      "max_value": "Maximal cart items count"
    }
  },
  "pl": {
    "form": {
      "min_value": "Minimalna ilość produktów w koszyku",
      "max_value": "Maksymalna ilość produktów w koszyku"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { CartLengthDiscountCondition } from '@/interfaces/SaleCondition'

export default Vue.extend({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<CartLengthDiscountCondition>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): CartLengthDiscountCondition {
        return this.value
      },
      set(v: CartLengthDiscountCondition) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
