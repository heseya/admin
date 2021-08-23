<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :name="name">
    <vs-input v-bind="$props" v-on="$listeners">
      <slot></slot>
      <template #message-danger>{{ errors[0] }}</template>
    </vs-input>
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
    'lodaing',
    'type',
    'border',
    'shadow',
    'disabled',
  ],
})
</script>
