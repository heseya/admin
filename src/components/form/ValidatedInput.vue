<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :name="name" class="input-wrapper">
    <app-input v-bind="$props" :data-cy="dataCy || name" v-on="$listeners">
      <slot></slot>
      <template #label>
        <slot name="label"></slot>
      </template>
      <template #error>{{ errors[0] }}</template>
    </app-input>
  </validation-provider>
</template>

<script lang="ts">
/* eslint-disable vue/require-prop-types */
import { defineComponent } from 'vue'
import { ValidationProvider } from 'vee-validate'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: [
    'name',
    'value',
    'rules',
    'label',
    'placeholder',
    'color',
    'state',
    'progress',
    'loading',
    'dataCy',
    'type',
    'min',
    'max',
    'step',
    'precision',
    'rows',
    'border',
    'shadow',
    'disabled',
    'allowClear',
    'addonBefore',
    'addonAfter',
  ],
})
</script>

<style lang="scss" scoped>
.input-wrapper {
  display: block;
  width: 100%;
}
</style>
