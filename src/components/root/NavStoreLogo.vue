<template>
  <div class="nav-logo">
    <img src="@/assets/images/heseya.svg" alt="Heseya" class="nav-logo__logo" />
    <span class="nav-logo__title">Dodaj swoje logo</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
.nav-logo {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 8px 10px;
  border-radius: 8px;
  background-color: $backgroundColor;
  border: dashed 2px $backgroundAccentColor;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &__title {
    font-size: 0.8em;
    letter-spacing: -0.24px;
    color: $lightenPrimaryColor;
  }

  &__logo {
    width: 130px;
    opacity: 0.6;
  }
}
</style>
