<template>
  <div class="generate-recovery-codes">
    <h3>Kody odzyskujące</h3>
    <p>
      Kody odzyskujące mogą okazać się potrzebne gdy stracisz urządzenie na którym aktywowałeś
      podwójną weryfikacje. Kodów możesz użyć do zalogowania, pamiętaj jednak, że są jednorazowe!
    </p>
    <p>
      Jeśli zgubiłeś lub wykorzystałeś swoje kody odzyskujące, możesz je wygenerować poniżej.
      Poprzednie kody odzyskujące przestaną działać.
    </p>
    <app-button type="primary">Wygeneruj kody odzyskujące</app-button>
  </div>
</template>

<script lang="ts">
import AppButton from '@/components/layout/AppButton.vue'
import Vue from 'vue'
export default Vue.extend({
  components: { AppButton },
})
</script>

<style lang="scss" scoped>
.generate-recovery-codes {
}
</style>
