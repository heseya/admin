<template>
  <validation-observer v-slot="{ handleSubmit }" class="schema-form">
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      name="name"
      rules="required"
      label="Nazwa"
    />

    <br />
    <app-button :disabled="disabled" @click.stop="handleSubmit(submit)"> Zapisz </app-button>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationObserver } from 'vee-validate'

import { WebHookDto } from '@/interfaces/Webhook'

// const CLEAR_FORM: WebHookDto = {}

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<WebHookDto>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): WebHookDto {
        return this.value
      },
      set(discount: WebHookDto) {
        this.$emit('input', discount)
      },
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this.form)
    },
  },
})
</script>

<style lang="scss">
.schema-form {
  .flex {
    display: flex;

    > * {
      width: 100%;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .used-schema {
    display: flex;
    justify-content: space-between;
  }
}
</style>
