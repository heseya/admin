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
    <small>{{ $t('info') }}</small>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "form": {
      "start_at": "Start at",
      "end_at": "End at"
    },
    "info": "Hours are stored in UTC time zone, if your store operates in a different time zone you have to take this into account when setting the hours."
  },
  "pl": {
    "form": {
      "start_at": "Godzina początkowa",
      "end_at": "Godzina końcowa"
    },
    "info": "Godziny są zapisywane w strefie czasowej UTC, jeśli sklep operuje w innej strefie czasowej, musić wziać na to poprawkę ustawiając godziny."
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { TimeBetweenDiscountCondition } from '@heseya/store-core'

export default defineComponent({
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<TimeBetweenDiscountCondition>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // @ts-ignore // ? Unofficial Vue api
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
