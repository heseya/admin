<template>
  <app-select
    :value="value"
    :label="label"
    :add-all="addAll"
    option-filter-prop="label"
    @input="(e) => $emit('input', e)"
    @change="(e) => $emit('change', e)"
  >
    <a-select-option :value="'1'" :label="trueText || $t('common.yes')">
      {{ trueText || $t('common.yes') }}
    </a-select-option>
    <a-select-option :value="'0'" :label="$t('common.no')">
      {{ falseText || $t('common.no') }}
    </a-select-option>
  </app-select>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: { type: String, default: null },
    label: { type: String, default: null },
    trueText: { type: String, default: null },
    falseText: { type: String, default: null },
    addAll: { type: Boolean, default: true },
  },
})
</script>
