<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal
      v-model="isActive"
      class="password-confirm-modal"
      :ok-text="okText"
      :cancel-text="$t('common.cancel')"
      :title="title"
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
    "password": "Hasło"
  },
  "en": {
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
      default: 'Wpisz swoje hasło, aby potwierdzić operację',
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
