<template>
  <a-tooltip :placement="tooltipPlacement" class="copyable-tag">
    <template #title>
      <div class="copyable-tag__tooltip">
        <p>{{ text }}</p>
        <b v-if="isClipboard">{{ copied ? $t('copied') : $t('copy') }}</b>
      </div>
    </template>
    <Tag v-bind="$props" class="copyable-tag__tag" @click.prevent.stop="copy">
      <span class="copyable-tag__tag-text">{{ text }}</span>
    </Tag>
  </a-tooltip>
</template>

<i18n lang="json">
{
  "en": {
    "copy": "Click to copy",
    "copied": "Copied!"
  },
  "pl": {
    "copy": "Kliknij aby skopiować",
    "copied": "Skopiowano!"
  }
}
</i18n>

<script lang="ts">
import { formatApiNotificationError } from '@/utils/errors'
import { defineComponent } from 'vue'
import Tag from './Tag.vue'

export default defineComponent({
  components: {
    Tag,
  },

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
    tooltipPlacement: {
      type: String,
      default: 'right',
    },
  },

  data: () => ({
    copied: false,
  }),

  computed: {
    isClipboard(): boolean {
      return Boolean(navigator.clipboard)
    },
  },

  methods: {
    async copy() {
      if (!this.isClipboard) return

      try {
        await navigator.clipboard.writeText(this.text)
        this.onCopied()
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },
    onCopied() {
      this.copied = true

      setTimeout(() => {
        this.copied = false
      }, 3000)
    },
  },
})
</script>

<style lang="scss" scoped>
.copyable-tag {
  &__tooltip {
    display: grid;
    place-items: center;
    padding: 8px;
    gap: 4px;

    & > * {
      margin: 0;
      text-align: center;
    }
  }

  &__tag {
    font-size: 0.7rem;
    max-width: 100%;

    &:hover {
      background-color: var(--primary-color-500);
    }
  }

  &__tag-text {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
