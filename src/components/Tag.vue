<template>
  <div
    class="tag"
    :class="{
      'tag--small': small,
      [`tag--${type}`]: true,
      'tag--copiable': isClipboard && allowCopy,
    }"
    :style="{ '--bg-color': color }"
    v-on="$listeners"
  >
    <slot>{{ text }}</slot>
  </div>
</template>

<script lang="ts">
import { formatApiNotificationError } from '@/utils/errors'
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
    allowCopy: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    isClipboard(): boolean {
      return Boolean(navigator.clipboard)
    },
  },
  methods: {
    async copy() {
      if (!this.isClipboard || !this.allowCopy) return
      try {
        await navigator.clipboard.writeText(this.text)
        this.$emit('copied')
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 3px;
  margin-top: 3px;
  background-color: var(--bg-color, #000000);
  padding: 4px 12px;
  color: #fff;
  font-size: 0.9em;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;

  > .bx {
    border-radius: 50%;
    background-color: var(--bg-color, #000000);
    color: #fff !important;
  }

  &--small {
    font-size: 0.7em;
  }

  &--success {
    background-color: $green-color-200;
    color: $green-color-500;

    > .bx {
      background-color: $green-color-500;
    }
  }

  &--error {
    background-color: $red-color-200;
    color: $red-color-500;

    > .bx {
      background-color: $red-color-500;
    }
  }

  &--primary {
    background-color: $primary-color-100;
    color: $primary-color-500;

    > .bx {
      background-color: $primary-color-500;
    }
  }

  &--copiable {
    &:hover {
      background-color: $primary-color-500;
    }
  }

  i {
    font-size: 1.2em;
    line-height: 1em;
    margin-right: 4px;
  }
}
</style>
