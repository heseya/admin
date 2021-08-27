<template>
  <nav class="top-nav">
    <div class="top-nav__header">
      <h1 class="top-nav__title">{{ title }}</h1>
      <small class="top-nav__subtitle">{{ subtitle }}</small>
    </div>

    <div class="top-nav__buttons">
      <slot></slot>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
  },
})
</script>

<style lang="scss">
.top-nav {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media ($viewport-6) {
    flex-direction: row;
    align-items: center;
  }

  &__header {
    margin-right: auto;
  }

  &__buttons {
    margin-left: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  &__title {
    display: inline-block;
    font-size: 28px;
    font-weight: 600;
    font-size: 1.7em;
    letter-spacing: -0.48px;
    margin: 0;
  }

  &__subtitle {
    display: block;
    color: #888;
  }

  &__buttons {
    display: flex;
  }
}
</style>
