<template>
  <div class="setup-intro">
    <h3>{{ $t('title') }}</h3>
    <p>
      {{ $t('text1') }}
    </p>
    <p>
      {{ $t('text2') }}
    </p>

    <h3 class="setup-intro__subtitle">{{ $t('subtitle') }}</h3>
    <div class="setup-intro__buttons">
      <app-button type="primary" @click="$emit('start-app')">{{ $t('app') }}</app-button>
      <app-button type="primary" @click="$emit('start-email')">{{ $t('email') }}</app-button>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Aktywuj weryfikację dwuetapową by zwiększyć bezpieczeństwo konta",
    "text1": "Weryfikacja dwuetapowa to podwójne sprawdzenie tożsamości (uwierzytelnianie) podczas logowania. Nie wystarczy podać samego hasła ale również ustalony drugi składnik - kod SMS lub aplikacji Authenticator.",
    "text2": "Pozwoli to na zabezpieczenie Twojego konta, w przypadku gdyby komuś udało się przejąć twoje hasło.",
    "subtitle": "Wybierz metodę weryfikacji dwuetapowej",
    "app": "Aplikacja",
    "email": "Email"
  },
  "en": {
    "title": "Activate two-factor authentication to increase security of your account",
    "text1": "Two-factor authentication is a double-factor authentication (authentication by two factors) that is used to increase the security of your account. It is not enough to enter only your password but also a second factor - SMS code or Authenticator app.",
    "text2": "This will allow you to secure your account, in case someone stole your password.",
    "subtitle": "Choose a two-factor authentication method",
    "app": "App",
    "email": "Email"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>

<style lang="scss" scoped>
.setup-intro {
  &__subtitle {
    text-align: center;
    margin-top: 24px;
  }

  &__buttons {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 24px;
  }
}
</style>
