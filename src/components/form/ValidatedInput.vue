<template>
  <validation-provider :rules="rules" v-slot="{ errors }">
    <vs-input v-on="$listeners" v-bind="$props">
      <slot></slot>
      <template #message-danger>{{ errors[0] }}</template>
    </vs-input>
  </validation-provider>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

export default Vue.extend({
  props: [
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
  ],
  components: {
    ValidationProvider,
  },
})
</script>
