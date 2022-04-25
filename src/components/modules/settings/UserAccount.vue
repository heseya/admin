<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form class="change-preferences-form" @submit.prevent="handleSubmit(changePreferences)">
      <validated-input
        v-model="form.name"
        name="name"
        :label="$t('username')"
        type="text"
        rules="required"
      >
      </validated-input>
      <div class="switches">
        <switch-input
          v-for="preference in Object.keys(form.preferences)"
          :key="preference"
          v-model="form.preferences[preference]"
          :label="$t(preference)"
          horizontal
        />
      </div>
      <hr />
      <div class="center">
        <app-button type="primary" :loading="isLoading" html-type="submit">
          {{ $t('savePreferences') }}
        </app-button>
      </div>
    </form>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "username": "Nazwa użytkownika",
    "successfull_login_attempt_alert":"Powiadomienie o sukcesie logowania",
    "failed_login_attempt_alert":"Powiadomienie o nieudanym logowaniu",
    "new_localization_login_alert":"Powiadomienie o logowaniu z nowej lokalizacji",
    "recovery_code_changed_alert":"Powiadomienie o zmianie kodu przywracania",
    "savePreferences": "Zapisz zmiany",
    "successMessage": "Preferencje zostały zmienione"
  },
  "en": {
    "username": "User name",
    "successfull_login_attempt_alert":"Successfull login attempt alert",
    "failed_login_attempt_alert":"Failed login attempt alert",
    "new_localization_login_alert":"New localization login alert",
    "recovery_code_changed_alert":"Recovery code changed alert",
    "savePreferences": "Save preferences",
    "successMessage": "Preferences changed"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'

import { formatApiNotificationError } from '@/utils/errors'
import { User, UserProfileUpdateDTO } from '@/interfaces/User'

const UPDATE_USER_PREFERENCES_FORM: UserProfileUpdateDTO = {
  name: '',
  preferences: {
    successfull_login_attempt_alert: true,
    failed_login_attempt_alert: true,
    new_localization_login_alert: true,
    recovery_code_changed_alert: true,
  },
}

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    user: {
      type: Object,
      required: true,
    } as Vue.PropOptions<User>,
  },
  data: () => ({
    form: {} as UserProfileUpdateDTO,
    isLoading: false,
  }),
  watch: {
    user(v) {
      this.form = cloneDeep({ ...UPDATE_USER_PREFERENCES_FORM, ...v })
    },
  },
  created() {
    this.form = cloneDeep({ ...UPDATE_USER_PREFERENCES_FORM, ...this.user })
  },
  methods: {
    async changePreferences() {
      try {
        this.isLoading = true
        await this.$accessor.auth.updateUserProfile(this.form)
        this.$toast.success(this.$t('successMessage') as string)
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

<style lang="scss" scoped>
.change-preferences-form {
  .switches {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin-top: 12px;
    padding: 0 10px;

    .switch-input {
      justify-content: start;
    }
  }
}
.center {
  display: flex;
  justify-content: center;
}
</style>
