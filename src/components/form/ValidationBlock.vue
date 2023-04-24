<template>
  <validation-provider v-slot="{ errors }" rules="block-if-error">
    <input :value="block" name="is-duplicated-error" type="hidden" />
    <a-alert v-if="errors.length" type="error" show-icon :message="message" />
  </validation-provider>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

export default Vue.extend({
  components: { ValidationProvider },
  props: {
    block: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
  },
})
</script>
