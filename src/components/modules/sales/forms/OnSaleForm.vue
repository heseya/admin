<template>
  <div class="order-value-form">
    <div class="condition-form__row">
      <switch-input v-model="form.on_sale" :disabled="disabled">
        <template #title>
          {{ $t('form.on_sale') }}
          <info-tooltip>{{ $t('tooltips.on_sale') }}</info-tooltip>
        </template>
      </switch-input>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "form": {
      "on_sale": "Only for discounted products"
    },
    "tooltips": {
      "on_sale": "If checked, this code will only apply to discounted products"
    }
  },
  "pl": {
    "form": {
      "on_sale": "Tylko dla produktów przecenionych"
    },
    "tooltips": {
      "on_sale": "Jeżeli zaznaczone, kod ten będzie miał zastosowanie tylko dla produktów przecenionych"
    }
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import { defineComponent, PropType } from 'vue'
import { DiscountConditionType } from '@heseya/store-core'

import SwitchInput from '@/components/form/SwitchInput.vue'

type OnSaleForm = {
  type: DiscountConditionType
  on_sale: boolean
}

export default defineComponent({
  components: { SwitchInput },
  props: {
    value: { type: Object as PropType<OnSaleForm>, required: true },
    type: { type: String as PropType<DiscountConditionType>, required: true },
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
      get(): OnSaleForm {
        return this.value
      },
      set(v: OnSaleForm) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
