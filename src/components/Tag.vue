<template>
  <div
    class="tag"
    :class="{ 'tag--small': small, [`tag--${type}`]: true }"
    :style="{ '--bg-color': color }"
  >
    <slot> {{ text }} </slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'default',
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  margin-right: 3px;
  margin-top: 3px;
  background-color: var(--bg-color, #000000);
  padding: 3px 6px;
  color: #ffffff;
  font-size: 0.9em;
  border-radius: 3px;

  &--small {
    font-size: 0.7em;
  }

  &--success {
    background-color: $green-color-500;
  }

  &--error {
    background-color: $red-color-500;
  }

  &--primary {
    background-color: $primary-color-500;
  }
}
</style>
