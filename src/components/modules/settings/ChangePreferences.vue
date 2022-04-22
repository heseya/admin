<template>
  <validation-observer v-slot="{ handleSubmit }" class="change-preferences-form">
    <validated-input
      v-model="form.name"
      name="name"
      :label="$t('login')"
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
      <app-button type="primary" :loading="isLoading" @click="handleSubmit(changePreferences)">
        {{ $t('savePreferences') }}
      </app-button>
    </div>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "login": "Nazwa użytkownika",
    "successfull_login_attempt_alert":"Powiadomienie o sukcesie logowania",
    "failed_login_attempt_alert":"Powiadomienie o nieudanym logowaniu",
    "new_localization_login_alert":"Powiadomienie o logowaniu z nowej lokalizacji",
    "recovery_code_changed_alert":"Powiadomienie o zmianie kodu przywracania",
    "savePreferences": "Zapisz zmiany",
    "changePreferencesSuccess": "Preferencje zostały zmienione"
  },
  "en": {
    "login": "User name",
    "successfull_login_attempt_alert":"Successfull login attempt alert",
    "failed_login_attempt_alert":"Failed login attempt alert",
    "new_localization_login_alert":"New localization login alert",
    "recovery_code_changed_alert":"Recovery code changed alert",
    "savePreferences": "Save preferences",
    "changePreferencesSuccess": "Preferences changed"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { formatApiNotificationError } from '@/utils/errors'
import { User } from '@sentry/types'
import { UpdateUserPreferences } from '@/store/auth'
import { cloneDeep } from 'lodash'

const UpdateUserPreferencesForm: UpdateUserPreferences = {
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
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<User>,
  },
  data: () => ({
    form: {} as UpdateUserPreferences,
    isLoading: false,
  }),
  computed: {
    userData: {
      get(): User {
        return this.value
      },
    },
  },
  watch: {
    userData(v) {
      this.form = cloneDeep({ ...UpdateUserPreferencesForm, ...v })
    },
  },
  created() {
    this.form = cloneDeep({ ...UpdateUserPreferencesForm, ...this.userData })
  },
  methods: {
    async changePreferences() {
      try {
        this.isLoading = true
        await this.$accessor.auth.updatePreferences(this.form)
        this.$toast.success(this.$t('changePreferencesSuccess') as string)
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

<style lang="scss">
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
