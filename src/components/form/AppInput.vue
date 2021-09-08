<template>
  <div class="app-input">
    <label class="app-input__label">
      <slot name="label"> {{ label }} </slot>
    </label>
    <a-input v-model="innerValue" class="app-input__input" v-bind="$props" />
    <span class="app-input__error">
      <slot name="error"> {{ error }} </slot>
    </span>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/require-prop-types */
import Vue from 'vue'

export default Vue.extend({
  name: 'AppInput',
  props: [
    'value',
    'label',
    'placeholder',
    'name',
    'error',
    'type',
    'size',
    'allowClear',
    'disabled',
    'addonBefore',
  ],
  computed: {
    innerValue: {
      get(): any {
        return this.value
      },
      set(v: any) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
