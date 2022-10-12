<template>
  <div
    class="avatar"
    :class="{ 'avatar--small': small, 'avatar--tiny': tiny }"
    :style="{ '--bg-color': color, '--text-color': textColor }"
  >
    <div class="avatar__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Avatar',
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    tiny: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#000',
    },
    textColor: {
      type: String,
      default: '#fff',
    },
  },
})
</script>

<style lang="scss" scoped>
.avatar {
  background: var(--bg-color, var(--black-color));
  color: var(--text-color, var(--white-color));
  overflow: hidden;
  font-size: 1.7em;
  width: 100%;
  height: 100%;
  transition: all 0.25s ease;
  border-radius: 7px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &--small {
    width: 32px;
    height: 32px;
    font-size: 1.3em;
  }

  &--tiny {
    width: 22px;
    height: 22px;
    font-size: 1.1em;
  }

  img {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
