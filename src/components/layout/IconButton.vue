<template>
  <component
    :is="component"
    :to="to"
    class="icon-button"
    :class="[
      `icon-button--${type}`,
      `icon-button--${size}`,
      {
        'icon-button--disabled': disabled,
        'icon-button--reversed': reversed,
        'icon-button--no-text': !$slots.default,
      },
    ]"
    :disabled="disabled"
    @click="(e) => $emit('click', e)"
  >
    <div class="icon-button__text">
      <slot></slot>
    </div>
    <div class="icon-button__icon">
      <slot name="icon"></slot>
    </div>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    reversed: {
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
      default: 'primary',
    } as Vue.PropOptions<'default' | 'primary'>,
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
.icon-button {
  $root: &;

  $side-padding: 12px;
  $inner-margin: 6px;

  $small-icon-size: 24px;
  $default-icon-size: 29px;

  all: unset;
  cursor: pointer;
  color: $gray-color-500;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-weight: 300;
  font-size: 0.95em;
  padding-left: $side-padding;
  border-radius: 20px;
  transition: 0.3s;
  margin: 0 3px;

  &:hover {
    background-color: $background-color-700;
    color: $gray-color-500;
  }

  &__icon {
    width: $default-icon-size;
    height: $default-icon-size;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
    background-color: $background-color-700;
    margin-left: $inner-margin;

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }

  &--disabled {
    cursor: not-allowed;
  }

  &--reversed {
    flex-direction: row-reverse;
    padding-left: 0;
    padding-right: $side-padding;

    #{$root}__icon {
      margin-left: 0;
      margin-right: $inner-margin;
    }
  }

  &--no-text {
    padding: 0 !important;

    #{$root}__icon {
      margin: 0 !important;

      &:hover {
        filter: brightness(0.95);
      }
    }
  }

  &--small {
    font-size: 0.9em;

    #{$root}__icon {
      width: $small-icon-size;
      height: $small-icon-size;
    }
  }

  &--primary {
    color: $primary-color-500;

    #{$root}__icon {
      background-color: $primary-color-200;
    }

    &:hover {
      background-color: $primary-color-200;
      color: $primary-color-500;
    }
  }
}
</style>
