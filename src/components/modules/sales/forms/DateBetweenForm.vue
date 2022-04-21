<template>
  <div class="date-between-form">
    <div class="condition-form__row">
      <validated-input
        v-model="form.start_at"
        :name="`${formId}.start_at`"
        type="date"
        :rules="`required|date-same-or-before:@${formId}.end_at`"
        :disabled="disabled"
        :label="$t('form.start_at')"
      />
      <validated-input
        v-model="form.end_at"
        :name="`${formId}.end_at`"
        rules="required"
        type="date"
        :disabled="disabled"
        :label="$t('form.end_at')"
      />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "form": {
      "start_at": "Start at",
      "end_at": "End at"
    }
  },
  "pl": {
    "form": {
      "start_at": "Data początkowa",
      "end_at": "Data końcowa"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { DateBetweenDiscountCondition } from '@/interfaces/SaleCondition'

export default Vue.extend({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<DateBetweenDiscountCondition>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): DateBetweenDiscountCondition {
        return this.value
      },
      set(v: DateBetweenDiscountCondition) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
