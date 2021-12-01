<template>
  <div class="app-input">
    <label class="app-input__label">
      <slot name="label"> {{ label }} </slot>
    </label>
    <a-select
      v-model="innerValue"
      class="app-input__input"
      v-bind="$props"
      :data-cy="dataCy || name"
      @change="$emit('change')"
    >
      <a-select-option v-if="addAll" value="_all" label="Wszystkie"> Wszystkie </a-select-option>
      <slot></slot>
    </a-select>
    <span class="app-input__error">
      <slot name="error"> {{ error }} </slot>
    </span>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/require-default-prop */
import Vue from 'vue'

export default Vue.extend({
  name: 'AppSelect',
  props: {
    value: [String, Number, Array],
    label: String,
    placeholder: String,
    name: String,
    error: String,
    type: String,
    mode: String,
    size: String,
    allowClear: Boolean,
    loading: Boolean,
    disabled: Boolean,
    addAll: Boolean,
    showSearch: Boolean,
    optionFilterProp: String,
    dataCy: String,
  },
  computed: {
    innerValue: {
      get(): string | number | unknown[] {
        return this.value
      },
      set(v: string | number | unknown[]) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
