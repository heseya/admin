<template>
  <nav class="top-nav">
    <div class="top-nav__title">
      <h1 class="title">{{ title }}</h1>
      <small>{{ subtitle }}</small>
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
  margin-top: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__title {
    h1 {
      display: inline-block;
      font-size: 28px;
      font-weight: 200;
      margin: 0;
    }

    small {
      display: block;
      color: #888;
    }
  }

  &__buttons {
    display: flex;
  }

  &__button {
    display: inline-block;
    border-radius: 50%;
    margin-left: 12px;
    height: 28px;
    width: 28px;
    background-color: $grey-light;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;

    img {
      width: 15px;
      height: 15px;
    }
  }
}
</style>
