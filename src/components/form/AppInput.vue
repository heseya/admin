<template>
  <div class="app-input">
    <label class="app-input__label" :for="name">
      <slot name="label"> {{ label }} </slot>
    </label>

    <component
      :is="component"
      v-bind="$props"
      :id="name"
      ref="input"
      v-model="innerValue"
      class="app-input__input"
      :data-cy="dataCy"
      :show-time="isDateTime"
    />

    <span class="app-input__error">
      <slot name="error"> {{ error }} </slot>
    </span>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/require-prop-types */
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppInput',
  props: [
    'value',
    'label',
    'placeholder',
    'defaultValue',
    'name',
    'dataCy',
    'error',
    'type',
    'min',
    'max',
    'size',
    'step',
    'precision',
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
        if (this.type === 'number') v = Number(v)
        this.$emit('input', v)
      },
    },

    component(): string {
      if (this.type === 'password') return 'a-input-password'
      if (this.type === 'textarea') return 'a-textarea'
      if (this.type === 'number') return 'a-input-number'
      if (this.isDateTime) return 'a-date-picker'
      return 'a-input'
    },

    isDateTime(): boolean {
      return this.type === 'datetime-local'
    },
  },
  methods: {
    focus() {
      this.$nextTick(() => {
        ;((this.$refs.input as Vue).$el as HTMLInputElement).focus()
      })
    },
  },
})
</script>
