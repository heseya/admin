<template>
  <validation-observer v-slot="{ handleSubmit }">
    <validated-input
      v-model="oldPassword"
      icon-after
      :label="$t('currentPassword')"
      type="password"
      rules="required"
    >
    </validated-input>
    <validated-input
      v-model="newPassword"
      :label="$t('newPassword')"
      type="password"
      rules="required|password"
      name="newPassword"
    >
    </validated-input>
    <validated-input
      v-model="confirmNewPassword"
      :label="$t('confirmNewPassword')"
      type="password"
      rules="required|repeatPassword:@newPassword"
    >
    </validated-input>

    <hr />

    <div class="center">
      <app-button type="primary" :loading="isLoading" @click="handleSubmit(changePassword)">
        {{ $t('savePassword') }}
      </app-button>
    </div>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "currentPassword": "Obecne hasło",
    "newPassword": "Nowe hasło",
    "confirmNewPassword": "Powtórz nowe hasło",
    "savePassword": "Zmień hasło",
    "savePasswordSuccess": "Hasło zostało zmienione",
    "passwordsAreNotTheSame": "Hasła nie są identyczne"
  },
  "en": {
    "currentPassword": "Current password",
    "newPassword": "New password",
    "confirmNewPassword": "Confirm new password",
    "savePassword": "Change password",
    "savePasswordSuccess": "Password changed",
    "passwordsAreNotTheSame": "Passwords are not the same"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  data: () => ({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    isLoading: false,
  }),
  methods: {
    async changePassword() {
      try {
        this.isLoading = true

        if (this.newPassword !== this.confirmNewPassword)
          throw new Error(this.$t('passwordsAreNotTheSame') as string)

        await this.$accessor.auth.changePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        })

        this.$toast.success(this.$t('savePasswordSuccess') as string)
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      } finally {
        this.isLoading = false
        this.$emit('close')
      }
    },
  },
})
</script>

<style>
.center {
  display: flex;
  justify-content: center;
}
</style>
