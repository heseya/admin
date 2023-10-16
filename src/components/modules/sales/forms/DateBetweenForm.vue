<template>
  <div class="date-between-form">
    <div class="condition-form__row">
      <validated-input
        v-model="formStartAt"
        :name="`${formId}.start_at`"
        type="date"
        :rules="`required|date-same-or-before:@${formId}.end_at`"
        :disabled="disabled"
        :label="$t('form.start_at').toString()"
      />
      <validated-input
        v-model="formEndAt"
        :name="`${formId}.end_at`"
        rules="required"
        type="date"
        :disabled="disabled"
        :label="$t('form.end_at').toString()"
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
    "info": "Dates are stored in UTC time zone, if your store operates in a different time zone you have to take this into account when setting the dates."
  },
  "pl": {
    "form": {
      "start_at": "Data początkowa",
      "end_at": "Data końcowa"
    },
    "info": "Daty są zapisywane w strefie czasowej UTC, jeśli sklep operuje w innej strefie czasowej, musić wziać na to poprawkę ustawiając daty."
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DateBetweenDiscountCondition } from '@heseya/store-core'
import { formatDateInput } from '@/utils/dates'

export default defineComponent({
  props: {
    value: { type: Object as PropType<DateBetweenDiscountCondition>, required: true },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // @ts-ignore // ? Unofficial Vue api
      return this._uid
    },
    form: {
      get(): DateBetweenDiscountCondition {
        return {
          ...this.value,
          start_at: formatDateInput(this.value.start_at),
          end_at: formatDateInput(this.value.end_at),
        }
      },
      set(v: DateBetweenDiscountCondition) {
        this.$emit('input', v)
      },
    },
    formStartAt: {
      get(): string | null {
        return formatDateInput(this.value.start_at)
      },
      set(v: string | null) {
        this.form = { ...this.form, start_at: v }
      },
    },
    formEndAt: {
      get(): string | null {
        return formatDateInput(this.value.end_at)
      },
      set(v: string | null) {
        this.form = { ...this.form, end_at: v }
      },
    },
  },
})
</script>
