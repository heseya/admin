<template>
  <div class="setup-intro">
    <h3>Aktywuj weryfikację dwuetapową by zwiększyć bezpieczeństwo konta</h3>
    <p>
      Weryfikacja dwuetapowa to podwójne sprawdzenie tożsamości (uwierzytelnianie) podczas
      logowania. Nie wystarczy podać samego hasła ale również ustalony drugi składnik - kod SMS lub
      aplikacji Authenticator.
    </p>
    <p>
      Pozwoli to na zabezpieczenie Twojego konta, w przypadku gdyby komuś udało się przejąć twoje
      hasło.
    </p>

    <h3 class="setup-intro__subtitle">Wybierz metodę weryfikacji dwuetapowej</h3>
    <div class="setup-intro__buttons">
      <app-button type="primary" @click="$emit('start-app')">Aplikacja</app-button>
      <app-button type="primary" @click="$emit('start-email')">Email</app-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
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
