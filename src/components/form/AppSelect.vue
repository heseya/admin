<template>
  <div class="app-input">
    <label class="app-input__label">
      <slot name="label"> {{ label }} </slot>
    </label>
    <a-select
      v-model="innerValue"
      class="app-input__input"
      v-bind="$props"
      @change="$emit('change')"
    >
      <a-select-option v-if="addAll" value="_all"> Wszystkie </a-select-option>
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
    value: [String, Number],
    label: String,
    placeholder: String,
    name: String,
    error: String,
    type: String,
    size: String,
    allowClear: Boolean,
    disabled: Boolean,
    addAll: Boolean,
  },
  computed: {
    innerValue: {
      get(): string | number {
        return this.value
      },
      set(v: string | number) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
