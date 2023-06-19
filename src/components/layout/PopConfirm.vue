<template>
  <a-popover v-model="visible" :placement="placement" :trigger="trigger">
    <slot></slot>

    <template #content>
      <div class="pop-confirm">
        <p>
          <slot name="title">{{ title || $t('default.question') }}</slot>
        </p>
        <footer>
          <app-button :type="okColor" size="small" data-cy="pop-confirm-btn" @click="confirm">
            {{ okText || $t('default.confirm') }}
          </app-button>
          <app-button size="small" data-cy="pop-cancel-btn" @click="cancel">
            {{ cancelText || $t('default.cancel') }}
          </app-button>
        </footer>
      </div>
    </template>
  </a-popover>
</template>

<i18n lang="json">
{
  "pl": {
    "default": {
      "question": "Jesteś pewny?",
      "confirm": "Tak",
      "cancel": "Nie"
    }
  },
  "en": {
    "default": {
      "question": "Are you sure?",
      "confirm": "Yes",
      "cancel": "No"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PopConfirm',
  props: {
    title: {
      type: String,
      default: null,
    },
    okText: {
      type: String,
      default: null,
    },
    okColor: {
      type: String,
      default: 'danger',
    },
    cancelText: {
      type: String,
      default: null,
    },
    placement: {
      type: String,
      default: 'top',
    },
    trigger: {
      type: String,
      default: 'click',
    },
  },
  data: () => ({
    visible: false,
  }),
  methods: {
    close() {
      this.visible = false
    },
    confirm() {
      this.$emit('confirm')
      this.close()
    },
    cancel() {
      this.$emit('cancel')
      this.close()
    },
  },
})
</script>

<style lang="scss" scoped>
.pop-confirm {
  max-width: 300px;

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
