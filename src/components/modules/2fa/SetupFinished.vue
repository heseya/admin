<template>
  <div class="setup-finished">
    <h3><i class="bx bxs-check-circle"></i> Weryfikacja dwuetapowa została aktywowana!</h3>
    <p>
      Poniżej widzisz kody odzyskujące. Zapisz je w bezpiecznym miejscu. Mogą okazać się potrzebne
      gdy stracisz urządzenie na którym aktywowałeś podwójną weryfikacje. Kodów możesz użyć do
      zalogowania, pamiętaj jednak, że są jednorazowe! Nowe kody możesz wygenerować w ustawieniach.
    </p>
    <recovery-codes :codes="recoveryCodes" />

    <app-button type="primary" to="/settings"> Wróć do ustawień </app-button>
  </div>
</template>

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
