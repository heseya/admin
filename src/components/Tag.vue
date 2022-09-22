<template>
  <div
    class="tag"
    :class="{ 'tag--small': small, [`tag--${type}`]: true, 'tag--text-dark': isTextDark }"
    :style="{ '--bg-color': color }"
    v-on="$listeners"
  >
    <slot>{{ text }}</slot>
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
  computed: {
    isTextDark(): boolean {
      if (!this.color) return false
      const [red, green, blue] = this.color // Hex color e.g. #ff0000
        .replace('#', '')
        .match(/.{1,2}/g)
        ?.map((x) => parseInt(x, 16)) || [0, 0, 0]

      // Formula from https://stackoverflow.com/a/3943023
      return red * 0.299 + green * 0.587 + blue * 0.114 > 186
    },
  },
})
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 3px;
  margin-top: 3px;
  background-color: var(--bg-color, var(--black-color));
  padding: 4px 12px;
  color: var(--white-color);
  font-size: 0.9em;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;

  > .bx {
    border-radius: 50%;
    background-color: var(--bg-color, var(--black-color));
    color: var(--white-color) !important;
  }

  &--text-dark {
    color: var(--font-color);
  }

  &--small {
    font-size: 0.7em;
  }

  &--success {
    background-color: var(--green-color-200);
    color: var(--green-color-500);

    > .bx {
      background-color: var(--green-color-500);
    }
  }

  &--error {
    background-color: var(--red-color-200);
    color: var(--red-color-500);

    > .bx {
      background-color: var(--red-color-500);
    }
  }

  &--primary {
    background-color: var(--primary-color-100);
    color: var(--primary-color-500);

    > .bx {
      background-color: var(--primary-color-500);
    }
  }

  i {
    font-size: 1.2em;
    line-height: 1em;
    margin-right: 4px;
  }
}
</style>
