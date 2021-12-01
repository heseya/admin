<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :name="name">
    <app-input v-bind="$props" :data-cy="dataCy || name" v-on="$listeners">
      <slot></slot>
      <template #error>{{ errors[0] }}</template>
    </app-input>
  </validation-provider>
</template>

<script lang="ts">
/* eslint-disable vue/require-prop-types */
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

export default Vue.extend({
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
    'step',
    'rows',
    'border',
    'shadow',
    'disabled',
    'allowClear',
    'addonBefore',
  ],
})
</script>
