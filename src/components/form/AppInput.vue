<template>
  <div class="app-input">
    <label class="app-input__label" :for="name">
      <slot name="label"> {{ label }} </slot>
    </label>

    <component
      :is="component"
      v-bind="$props"
      :id="name"
      v-model="innerValue"
      class="app-input__input"
      :data-cy="dataCy"
    />

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
    'dataCy',
    'error',
    'type',
    'min',
    'max',
    'size',
    'step',
    'allowClear',
    'disabled',
    'rows',
    'loading',
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

    component(): string {
      if (this.type === 'password') return 'a-input-password'
      if (this.type === 'textarea') return 'a-textarea'
      return 'a-input'
    },
  },
})
</script>
