<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :name="name">
    <switch-input v-bind="$props" :data-cy="dataCy || name" v-on="$listeners">
      <template #title>
        <slot name="title" />
      </template>
      <template #error>{{ errors[0] }}</template>
    </switch-input>
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
  props: ['rules', 'value', 'disabled', 'horizontal', 'label', 'name', 'dataCy'],
})
</script>
