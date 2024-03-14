<template>
  <div class="cart-length-form">
    <validated-input
      v-model="form.min_value"
      :name="`${formId}.min_value`"
      type="number"
      :rules="`not-negative|less-or-equal-than:@${formId}.max_value`"
      :disabled="disabled"
      :label="$t(`form.min_${formType}_value`).toString()"
    />
    <validated-input
      v-model="form.max_value"
      :name="`${formId}.max_value`"
      rules="not-negative"
      type="number"
      :disabled="disabled"
      :label="$t(`form.max_${formType}_value`).toString()"
    />
  </div>
</template>

<i18n lang="json">
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
import { defineComponent, PropType } from 'vue'
import {
  DiscountConditionType,
  CartLengthDiscountCondition,
  CouponsCountDiscountCondition,
} from '@heseya/store-core'

type CartCouponsForm = CartLengthDiscountCondition | CouponsCountDiscountCondition

export default defineComponent({
  props: {
    value: { type: Object as PropType<CartCouponsForm>, required: true },
    type: {
      type: String as PropType<
        DiscountConditionType.CouponsCount | DiscountConditionType.CartLength
      >,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    formId(): string {
      // @ts-ignore // ? Unofficial Vue api
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
    formType(): string {
      return this.type === DiscountConditionType.CartLength ? 'items' : 'coupons'
    },
  },
})
</script>
