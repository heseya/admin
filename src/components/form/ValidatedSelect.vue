<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :name="name" class="select-wrapper">
    <app-select v-bind="$props" :data-cy="dataCy || name" :error="errors[0]" v-on="$listeners">
      <a-select-option v-for="option in options" :key="option[optionKey]" :label="option.name">
        {{ option.name }}
      </a-select-option>
    </app-select>
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
    'loading',
    'dataCy',
    'type',
    'disabled',
    'mode',
    'optionFilterProp',
    'options',
    'optionKey',
    'error',
    'size',
    'allowClear',
    'addAll',
    'allText',
    'showSearch',
    'labelInValue',
    'tokenSeparators',
  ],
})
</script>

<style lang="scss" scoped>
.select-wrapper {
  display: block;
  width: 100%;
}
</style>
