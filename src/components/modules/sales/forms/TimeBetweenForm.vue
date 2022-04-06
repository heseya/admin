<template>
  <div class="time-between-form">
    <div class="condition-form__row">
      <validated-input
        v-model="form.start_at"
        :name="`${formId}.start_at`"
        type="time"
        :rules="`required|time-same-or-before:@${formId}.end_at`"
        :disabled="disabled"
        step="2"
        :label="$t('form.start_at')"
      />
      <validated-input
        v-model="form.end_at"
        :name="`${formId}.end_at`"
        rules="required"
        type="time"
        step="2"
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
      "start_at": "Godzina początkowa",
      "end_at": "Godzina końcowa"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { TimeBetweenDiscountCondition } from '@/interfaces/SaleCondition'

export default Vue.extend({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<TimeBetweenDiscountCondition>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // ? Unofficial Vue api
      // @ts-ignore
      return this._uid
    },
    form: {
      get(): TimeBetweenDiscountCondition {
        return this.value
      },
      set(v: TimeBetweenDiscountCondition) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
