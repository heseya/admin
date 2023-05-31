<template>
  <validation-observer v-slot="{ handleSubmit }">
    <form class="change-preferences-form" @submit.prevent="handleSubmit(saveProfile)">
      <validated-input
        v-model="form.name"
        name="name"
        :label="$t('username')"
        type="text"
        rules="required"
      />
      <validated-input v-model="form.phone" name="phone" :label="$t('phone')" type="tel" rules="" />
      <validated-input
        v-model="form.birthday_date"
        name="birthday_date"
        :label="$t('birthday')"
        type="date"
        rules=""
      />
      <div v-if="form.preferences" class="switches">
        <switch-input
          v-for="preference in Object.keys(form.preferences)"
          :key="preference"
          v-model="form.preferences[preference]"
          :label="$t(preference)"
          horizontal
        />
      </div>

      <template v-if="user.metadata_personal">
        <hr />
        <MetadataForm
          ref="personalMeta"
          :value="user.metadata_personal"
          type="personal"
          model="auth"
        />
      </template>
      <hr />
      <div class="center">
        <app-button type="primary" :loading="isLoading" html-type="submit">
          {{ $t('savePreferences') }}
        </app-button>
      </div>
    </form>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "username": "Nazwa użytkownika",
    "phone": "Numer telefonu",
    "birthday": "Data urodzenia",
    "successful_login_attempt_alert": "Powiadomienie o sukcesie logowania",
    "failed_login_attempt_alert": "Powiadomienie o nieudanym logowaniu",
    "new_localization_login_alert": "Powiadomienie o logowaniu z nowej lokalizacji",
    "recovery_code_changed_alert": "Powiadomienie o zmianie kodu przywracania",
    "savePreferences": "Zapisz zmiany",
    "successMessage": "Preferencje zostały zmienione"
  },
  "en": {
    "username": "User name",
    "phone": "Phone number",
    "birthday": "Birthday",
    "successful_login_attempt_alert": "Successfull login attempt alert",
    "failed_login_attempt_alert": "Failed login attempt alert",
    "new_localization_login_alert": "New localization login alert",
    "recovery_code_changed_alert": "Recovery code changed alert",
    "savePreferences": "Save preferences",
    "successMessage": "Preferences changed"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { cloneDeep } from 'lodash'
import { ValidationObserver } from 'vee-validate'
import { User, UserProfileUpdateDto } from '@heseya/store-core'

import { formatApiNotificationError } from '@/utils/errors'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'

const UPDATE_USER_FORM: UserProfileUpdateDto = {
  name: '',
  birthday_date: '',
  phone: '',
  preferences: {
    successful_login_attempt_alert: true,
    failed_login_attempt_alert: true,
    new_localization_login_alert: true,
    recovery_code_changed_alert: true,
  },
}

export default defineComponent({
  components: {
    ValidationObserver,
    MetadataForm,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  data: () => ({
    form: {} as UserProfileUpdateDto,
    isLoading: false,
  }),
  watch: {
    user(user: User) {
      this.form = cloneDeep({
        ...UPDATE_USER_FORM,
        name: user.name,
        birthday_date: user.birthday_date ?? undefined,
        phone: user.phone ?? undefined,
        preferences: user.preferences || UPDATE_USER_FORM.preferences,
      })
    },

    '$accessor.auth.error'(error) {
      if (error) this.$toast.error(formatApiNotificationError(error))
    },
  },
  created() {
    this.form = cloneDeep({
      ...UPDATE_USER_FORM,
      name: this.user.name,
      birthday_date: this.user.birthday_date ?? undefined,
      phone: this.user.phone ?? undefined,
      preferences: this.user.preferences || UPDATE_USER_FORM.preferences,
    })
  },
  methods: {
    async saveProfile() {
      this.isLoading = true
      await this.saveMetadata()
      const success = await this.$accessor.auth.updateUserProfile({
        ...this.form,
        name: this.form.name as string,
      })

      if (success) {
        this.$toast.success(this.$t('successMessage') as string)

        this.$emit('success')
      }
      this.isLoading = false
    },

    async saveMetadata() {
      await Promise.all([(this.$refs.personalMeta as MetadataRef)?.saveMetadata(this.user.id)])
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

    & > * {
      &:not(:first-child) {
        margin-top: 8px;
      }
    }

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
