<template>
  <div class="central-screen-form">
    <card class="central-screen-form__card">
      <slot name="title">
        <h1 class="central-screen-form__title">{{ title }}</h1>
      </slot>

      <slot></slot>
    </card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '../layout/Card.vue'
export default Vue.extend({
  components: { Card },
  name: 'CentralScreenForm',
  props: {
    title: String,
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
}
</style>
