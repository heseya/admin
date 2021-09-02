<template>
  <component
    :is="component"
    :to="to"
    class="app-button"
    :class="[
      `app-button--${type}`,
      `app-button--${size}`,
      {
        'app-button--disabled': disabled,
        'app-button--loading': loading,
      },
    ]"
    :disabled="disabled"
    @click="(e) => !disabled && $emit('click', e)"
  >
    <div class="app-button__text">
      <slot></slot>
    </div>
    <div v-if="$slots.icon" class="app-button__icon">
      <slot name="icon"></slot>
    </div>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import Loading from './Loading.vue'
export default Vue.extend({
  components: { Loading },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    el: {
      type: String,
      default: 'button',
    },
    to: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'default',
    } as Vue.PropOptions<'default' | 'primary' | 'white' | 'success' | 'danger'>,
    size: {
      type: String,
      default: 'default',
    } as Vue.PropOptions<'small' | 'default'>,
  },
  computed: {
    component(): string {
      return this.to ? 'router-link' : this.el || 'button'
    },
  },
})
</script>

<style lang="scss">
.app-button {
  $root: &;

  $side-padding: 12px;
  $inner-margin: 6px;

  $small-icon-size: 16px;
  $default-icon-size: 24px;

  all: unset;
  background-color: #2d2e31;
  color: #fff;
  cursor: pointer;
  padding: 8px 16px;
  line-height: 1em;
  transition: 0.3s;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 4px;
  min-height: $default-icon-size;

  &:hover {
    background-color: #45464a;
    color: #fff;
  }

  &::before,
  &::after {
    visibility: hidden;
    opacity: 0;
    content: '';
    position: absolute;
    transition: 0.3s;
  }

  &::before {
    $padding: 3px;
    left: -$padding;
    top: -$padding;
    width: calc(100% + #{(2 * $padding)});
    height: calc(100% + #{(2 * $padding)});
    backdrop-filter: blur(2px) saturate(0.9);
  }

  &::after {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: solid 2px #fff;
    border-top-color: #fff0;
    animation: spin infinite 0.6s;
  }

  &--loading {
    pointer-events: none;

    &::before,
    &::after {
      visibility: visible;
      opacity: 1;
    }
  }

  &__icon {
    width: $default-icon-size;
    height: $default-icon-size;
    font-size: 1.1em;
    margin-left: 12px;
    margin-right: -8px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }

  &--disabled {
    cursor: not-allowed;
  }

  &--small {
    font-size: 0.9em;
    min-height: $small-icon-size;

    #{$root}__icon {
      width: $small-icon-size;
      height: $small-icon-size;
    }
  }

  &--white {
    background-color: #fff;
    color: $font-color;
    box-shadow: $shadow;

    &:hover {
      background-color: #fff;
      color: $primary-color-500;
    }
  }

  &--primary {
    background-color: $primary-color-500;

    &:hover {
      background-color: $primary-color-700;
    }
  }
  &--success {
    background-color: $green-color-500;

    &:hover {
      background-color: $green-color-400;
    }
  }

  &--danger {
    background-color: $red-color-500;

    &:hover {
      background-color: $red-color-400;
    }
  }
}
</style>
