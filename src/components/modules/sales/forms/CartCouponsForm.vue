<template>
  <div class="cart-length-form">
    <validated-input
      v-model="form.min_value"
      :name="`${formId}.min_value`"
      type="number"
      :rules="`not-negative|less-than:@${formId}.max_value`"
      :disabled="disabled"
      :label="$t(`form.min_${formType}_value`)"
    />
    <validated-input
      v-model="form.max_value"
      :name="`${formId}.max_value`"
      rules="not-negative"
      type="number"
      :disabled="disabled"
      :label="$t(`form.max_${formType}_value`)"
    />
  </div>
</template>

<i18n>
{
  "en": {
    "form": {
      "min_items_value": "Minimal cart items count",
      "max_items_value": "Maximal cart items count",
      "min_coupons_value": "Minimal coupons count",
      "max_coupons_value": "Maximal coupons count"
    }
  },
  "pl": {
    "form": {
      "min_items_value": "Minimalna ilość produktów w koszyku",
      "max_items_value": "Maksymalna ilość produktów w koszyku",
      "min_coupons_value": "Minimalna ilość kuponów",
      "max_coupons_value": "Maksymalna ilość kuponów"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import {
  DiscountConditionType,
  CartLengthDiscountCondition,
  CouponsCountDiscountCondition,
} from '@/interfaces/SaleCondition'

type CartCouponsForm = CartLengthDiscountCondition | CouponsCountDiscountCondition

export default Vue.extend({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<CartCouponsForm>,
    type: { type: String, required: true } as Vue.PropOptions<DiscountConditionType>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    formType: '',
  }),
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): CartCouponsForm {
        return this.value
      },
      set(v: CartCouponsForm) {
        this.$emit('input', v)
      },
    },
  },
  created() {
    if (this.type === DiscountConditionType.CartLength) {
      this.formType = 'items'
    } else if (this.type === DiscountConditionType.CouponsCount) {
      this.formType = 'coupons'
    }
  },
})
</script>
