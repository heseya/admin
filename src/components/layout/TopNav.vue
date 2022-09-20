<template>
  <nav class="top-nav">
    <div class="top-nav__header">
      <component :is="tag" class="top-nav__title" data-cy="nav-title">
        <slot name="title">{{ title }}</slot>
      </component>
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
    tag: { type: String, default: 'h1' },
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
    display: inline-flex;
    align-items: center;
    font-size: 28px;
    font-weight: 600;
    font-size: 1.7em;
    letter-spacing: -0.48px;
    margin: 0;

    &:is(h2) {
      font-size: 1.1em;
    }

    .icon-button {
      color: $gray-color-500;
    }
  }

  &__subtitle {
    display: block;
    color: $gray-color-500;
  }

  &__buttons {
    display: flex;
  }
}
</style>
