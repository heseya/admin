<template>
  <div class="central-screen-form">
    <nav-store-logo disabled big class="central-screen-form__logo" />
    <card class="central-screen-form__card">
      <slot name="title">
        <h1 class="central-screen-form__title">{{ title }}</h1>
      </slot>

      <slot></slot>
    </card>

    <powered-by class="central-screen-form__powered-by" />

    <div class="central-screen-form__footer">{{ `&copy;` }} Heseya | v{{ version }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { version } from '../../../package.json'
import Card from '../layout/Card.vue'
import NavStoreLogo from '../root/NavStoreLogo.vue'
import PoweredBy from '../root/PoweredBy.vue'

export default Vue.extend({
  name: 'CentralScreenForm',
  components: { Card, NavStoreLogo, PoweredBy },
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
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 48px;

  @media ($viewport-7) {
    height: calc(100vh - 64px);
  }

  &__logo {
    max-width: 400px;
  }

  &__title {
    margin: 0;
    font-weight: 600;
    margin-bottom: 12px;
  }

  &__card {
    max-width: 400px;
    width: 100%;
    margin-top: 12px;

    @media ($viewport-10) {
      margin-top: 48px;
    }

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

  &__powered-by {
    margin-top: auto;
  }

  &__footer {
    position: fixed;
    bottom: 10px;
    right: 10px;
    text-align: center;
    font-size: 0.7em;
    color: $gray-color-600;
  }
}
</style>
