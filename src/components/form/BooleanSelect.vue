<template>
  <app-select
    :value="value"
    :add-all="addAll"
    option-filter-prop="label"
    @input="(e) => $emit('input', e)"
    @change="(e) => $emit('change', e)"
  >
    <template #label>
      <slot name="label"> {{ label }} </slot>
    </template>

    <a-select-option :value="trueValue" :label="trueText || $t('common.yes')">
      {{ trueText || $t('common.yes') }}
    </a-select-option>
    <a-select-option :value="falseValue" :label="$t('common.no')">
      {{ falseText || $t('common.no') }}
    </a-select-option>
  </app-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    value: { type: String, default: null },
    label: { type: String, default: null },
    trueText: { type: String, default: null },
    falseText: { type: String, default: null },
    trueValue: { type: [String, Number], default: '1' },
    falseValue: { type: [String, Number], default: '0' },
    addAll: { type: Boolean, default: true },
  },
})
</script>
