<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form class="setup-confirm" @submit.prevent="handleSubmit(confirm)">
      <validated-input
        v-model="confirmCode"
        rules="required"
        name="confirm_code"
        label="Kod autoryzacyjny"
      />
      <app-button type="primary" html-type="submit"> Aktywuj weryfikację dwuetapową </app-button>
    </form>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { confirmTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { ValidatedInput, ValidationObserver },
  data: () => ({
    confirmCode: '',
  }),
  methods: {
    async confirm() {
      const result = await confirmTwoFactorAuth(this.confirmCode)
      if (result.success) {
        this.$emit('confirmed', result.recoveryCodes)
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.setup-confirm {
  text-align: left;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
</style>
