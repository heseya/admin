<template>
  <div class="order-value-form">
    <div class="condition-form__row">
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

    <div class="condition-form__row">
      <switch-input v-model="form.is_in_range" :disabled="disabled">
        <template #title>
          {{ $t('form.is_in_range') }}
          <info-tooltip>{{ $t('tooltips.is_in_range') }}</info-tooltip>
        </template>
      </switch-input>
      <!-- <switch-input v-model="form.include_taxes" :label="$t('form.include_taxes')" /> -->
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "form": {
      "min_value": "Min order value",
      "max_value": "Max order value",
      "is_in_range": "Is in range",
      "include_taxes": "Include taxes"
    },
    "tooltips": {
      "is_in_range": "If checked, discount will be applied only if order value is in range, otherwise discount will be applied only if order value is out of range"
    }
  },
  "pl": {
    "form": {
      "min_value": "Minimalna wartość zamówienia",
      "max_value": "Maksymalna wartość zamówienia",
      "is_in_range": "Wartość z zakresu",
      "include_taxes": "Uwzględniaj podatek"
    },
    "tooltips": {
      "is_in_range": "Jeżeli zaznaczone, rabat będzie obowiązywał tylko jeżeli wartość zamówienia jest w zakresie, w przeciwnym wypadku rabat będzie obowiązywał tylko jeżeli wartość zamówienia jest poza zakresem"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { OrderValueDiscountCondition } from '@heseya/store-core'

import SwitchInput from '@/components/form/SwitchInput.vue'

export default Vue.extend({
  components: { SwitchInput },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<OrderValueDiscountCondition>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): OrderValueDiscountCondition {
        return this.value
      },
      set(v: OrderValueDiscountCondition) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
