<template>
  <div class="powered-by">
    <span class="powered-by__title">Powered by</span>
    <a href="https://heseya.com" target="_blank">
      <img src="@/assets/images/heseya-primary.svg" alt="Heseya" class="powered-by__logo" />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
.powered-by {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__title {
    font-size: 0.8em;
    font-weight: 300;
    letter-spacing: -0.24px;
    color: #bec1c7;
    margin-right: 10px;
  }

  &__logo {
    height: 22px;
  }
}
</style>
