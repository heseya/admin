<template>
  <div class="remove-2fa">
    <h3>Usunięcie weryfikacji dwuetapowej</h3>
    <p>
      Poniżej możesz usunąć weryfikację dwuetapową ze swojego konta. Będziesz mógł skonfigurować
      weryfikację dwuetapową ponownie.
    </p>
    <app-button type="danger">Dezaktywuj weryfikację dwuetapową</app-button>
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
.remove-2fa {
}
</style>
