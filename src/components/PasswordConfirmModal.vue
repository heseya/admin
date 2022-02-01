<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal
      v-model="isActive"
      class="password-confirm-modal"
      :ok-text="okText || $t('common.continue')"
      :cancel-text="$t('common.cancel')"
      :title="title || $t('defaultText')"
      :ok-type="okType"
      @ok="handleSubmit(confirm)"
    >
      <validated-input
        v-model="password"
        icon-after
        :label="$t('password')"
        type="password"
        rules="required"
      />
    </a-modal>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "defaultText": "Wpisz swoje hasło, aby potwierdzić operację.",
    "password": "Hasło"
  },
  "en": {
    "defaultText": "Enter your password to confirm the operation",
    "password": "Password"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
    okText: {
      type: String,
      default: 'Kontynuuj',
    },
    okType: {
      type: String,
      default: undefined,
    },
  },
  data: () => ({
    password: '',
  }),
  computed: {
    isActive: {
      get(): boolean {
        return this.value
      },
      set(v: boolean) {
        this.$emit('input', v)
      },
    },
  },
  watch: {
    isActive(v: boolean) {
      if (!v) this.password = ''
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.password)
    },
  },
})
</script>
