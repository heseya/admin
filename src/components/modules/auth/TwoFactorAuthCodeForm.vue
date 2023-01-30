<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form class="tfa-code-form" @submit.prevent.stop="handleSubmit(onSubmit)">
      <icon-button reversed size="small" class="tfa-code-form__cancel-btn" @click="$emit('cancel')">
        <template #icon>
          <i class="bx bx-left-arrow-alt"></i>
        </template>
        {{ $t('returnToLogin') }}
      </icon-button>

      <p v-if="method === TwoFactorAuthMethod.App">
        {{ $t('app2fa') }}
      </p>
      <p v-else-if="method === TwoFactorAuthMethod.Email">
        {{ $t('email2fa') }}
      </p>

      <validated-input
        v-model="code"
        rules="required"
        name="code"
        data-cy="code"
        :label="$t('code')"
        class="tfa-code-form__input"
      />

      <app-button data-cy="submitBtn" html-type="submit" type="primary">
        {{ $t('login') }}
      </app-button>
    </form>
  </ValidationObserver>
</template>

<i18n lang="json">
{
  "pl": {
    "returnToLogin": "Wróć do formularza logowania",
    "app2fa": "Wpisz poniżej kod autoryzacyjny, który wyświetla się na twoim urządzeniu w aplikacji do weryfikacji dwuetapowej.",
    "email2fa": "Wysłaliśmy do Ciebie wiadomość e-mail z kodem autoryzującym. Wpisz go poniżej aby się zalogować. Kod jest ważny przez 15 minut.",
    "code": "Kod autoryzacyjny",
    "login": "Zaloguj"
  },
  "en": {
    "returnToLogin": "Return to login form",
    "app2fa": "Enter the code from your device in the app to verify two-factor authentication.",
    "email2fa": "We have sent you an email with a code to verify your account. Enter it below to log in. The code is valid for 15 minutes.",
    "code": "Code",
    "login": "Login"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    } as Vue.PropOptions<TwoFactorAuthMethod>,
  },
  computed: {
    code: {
      get(): string {
        return this.value
      },
      set(value: string) {
        this.$emit('input', value)
      },
    },
    TwoFactorAuthMethod(): typeof TwoFactorAuthMethod {
      return TwoFactorAuthMethod
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.code)
    },
  },
})
</script>

<style lang="scss" scoped>
.tfa-code-form {
  &__cancel-btn {
    margin-bottom: 24px;
  }

  &__input {
    margin: 16px 0;
  }
}
</style>
