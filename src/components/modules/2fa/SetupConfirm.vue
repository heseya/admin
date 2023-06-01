<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form class="setup-confirm" @submit.prevent="handleSubmit(confirm)">
      <validated-input
        v-model="confirmCode"
        rules="required"
        name="confirm_code"
        :label="$t('confirmCode').toString()"
      />
      <app-button type="primary" html-type="submit"> {{ $t('activate2fa') }} </app-button>
    </form>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "confirmCode": "Kod autoryzacyjny",
    "activate2fa": "Aktywuj weryfikację dwuetapową"
  },
  "en": {
    "confirmCode": "Confirmation code",
    "activate2fa": "Activate two-factor authentication"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'

import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { confirmTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
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
