<template>
  <div class="setup-finished">
    <h3><i class="bx bxs-check-circle"></i> {{ $t('title') }}</h3>
    <p>
      {{ $t('message') }}
    </p>
    <recovery-codes :codes="recoveryCodes" />

    <app-button type="primary" to="/settings"> {{ $t('goToSettings') }} </app-button>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Weryfikacja dwuetapowa została aktywowana!",
    "message": "Poniżej widzisz kody odzyskujące. Zapisz je w bezpiecznym miejscu. Mogą okazać się potrzebne gdy stracisz urządzenie na którym aktywowałeś podwójną weryfikacje. Kodów możesz użyć do zalogowania, pamiętaj jednak, że są jednorazowe! Nowe kody możesz wygenerować w ustawieniach.",
    "goToSettings": "Wróć do ustawień"
  },
  "en": {
    "title": "Two-factor authentication has been activated!",
    "message": "Below you can find the recovery codes. Save them in a secure place. They may be required if you lose your device on which you activated two-factor authentication. The codes are one-time use only!",
    "goToSettings": "Go to settings"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import RecoveryCodes from './RecoveryCodes.vue'

export default Vue.extend({
  components: { RecoveryCodes },
  props: {
    recoveryCodes: {
      type: Array,
      required: true,
    } as Vue.PropOptions<string[]>,
  },
})
</script>

<style lang="scss" scoped>
.setup-finished {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .bxs-check-circle {
    color: $green-color-500;
  }
}
</style>
