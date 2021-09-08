<template>
  <div class="central-screen-form">
    <card class="central-screen-form__card">
      <slot name="title">
        <h1 class="central-screen-form__title">{{ title }}</h1>
      </slot>

      <slot></slot>
    </card>

    <div class="central-screen-form__footer">&copy; Heseya | v{{ version }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { version } from '../../../package.json'
import Card from '../layout/Card.vue'

export default Vue.extend({
  name: 'CentralScreenForm',
  components: { Card },
  props: {
    title: { type: String, default: '' },
  },
  computed: {
    version(): string {
      return version
    },
  },
})
</script>

<style lang="scss">
.central-screen-form {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  &__title {
    @extend .title;
    margin-bottom: 32px;
  }

  &__card {
    width: 300px;

    input {
      width: 100%;
    }
  }

  p {
    font-size: 0.9em;
    margin: 0;
    margin-top: -10px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
  }

  &__footer {
    position: fixed;
    bottom: 10px;
    right: 10px;
    text-align: center;
    font-size: 0.7em;
    color: #aaa;
  }
}
</style>
