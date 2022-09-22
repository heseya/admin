<template>
  <component
    :is="component"
    :to="to"
    class="icon-button"
    :type="htmlType"
    :data-cy="dataCy"
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
    @click="onClick"
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
    htmlType: {
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
    } as Vue.PropOptions<
      | 'default'
      | 'primary'
      | 'danger'
      | 'transparent'
      | 'transparent-white'
      | 'success'
      | 'black'
      | 'burgund'
    >,
    size: {
      type: String,
      default: 'default',
    } as Vue.PropOptions<'small' | 'default' | 'big'>,
    dataCy: { type: String, default: '' },
  },
  computed: {
    component(): string {
      return this.to ? 'router-link' : this.el || 'button'
    },
  },
  methods: {
    onClick(e: Event) {
      if (this.htmlType !== 'submit' && !this.to) e.preventDefault()
      this.$emit('click', e)
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
  $big-icon-size: 34px;

  all: unset;
  cursor: pointer;
  color: var(--gray-color-500);
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-weight: 300;
  font-size: 0.85rem;
  padding-left: $side-padding;
  border-radius: 20px;
  transition: 0.3s;
  margin: 3px;

  &:hover {
    background-color: var(--background-color-700);
    color: var(--gray-color-500);
  }

  &__icon {
    width: $default-icon-size;
    height: $default-icon-size;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
    background-color: var(--background-color-700);
    margin-left: $inner-margin;
    flex-shrink: 0;

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
    font-size: 0.8rem;

    #{$root}__icon {
      width: $small-icon-size;
      height: $small-icon-size;
    }
  }

  &--big {
    font-size: 1.2rem;

    #{$root}__icon {
      width: $big-icon-size;
      height: $big-icon-size;
    }
  }

  &--primary {
    color: var(--primary-color-500);

    #{$root}__icon {
      background-color: var(--primary-color-100);
    }

    &:hover {
      background-color: var(--primary-color-100);
      color: var(--primary-color-500);
    }
  }

  &--transparent {
    color: var(--font-color);

    #{$root}__icon {
      background-color: $transparent;
    }

    &:hover {
      background-color: var(--background-color-600);
      color: var(--font-color);
    }
  }

  &--transparent-white {
    color: #fff !important;

    #{$root}__icon {
      background-color: $transparent;
    }

    &:hover {
      background-color: var(--background-color-600);
      color: var(--font-color) !important;
    }
  }

  &--danger {
    color: var(--red-color-500);

    #{$root}__icon {
      background-color: var(--red-color-200);
    }

    &:hover {
      background-color: var(--red-color-200);
      color: var(--red-color-500);
    }
  }

  &--success {
    color: var(--green-color-500);

    #{$root}__icon {
      background-color: var(--green-color-200);
    }

    &:hover {
      background-color: var(--green-color-200);
      color: var(--green-color-500);
    }
  }

  &--black {
    color: #ffffff;

    #{$root}__icon {
      background-color: var(--font-color);
    }

    &:hover {
      background-color: var(--font-color);
      color: #ffffff;
    }
  }

  &--burgund {
    color: #ffffff;

    #{$root}__icon {
      background-color: var(--primary-color-500);
    }

    &:hover {
      background-color: var(--primary-color-500);
      color: #ffffff;
    }
  }
}
</style>
