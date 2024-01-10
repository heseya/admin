<template>
  <a-dropdown :trigger="!hideContextMenu ? ['contextmenu'] : []">
    <icon-button :class="`draggable-handle ${btnClass}`" size="small" type="transparent">
      <template #icon> <i class="bx bx-menu"></i> </template>
    </icon-button>

    <template #overlay>
      <a-menu>
        <a-menu-item @click="onDragTop">
          {{ $t('draggable.moveToTop') }}
        </a-menu-item>
        <a-menu-item @click="onDragBottom">
          {{ $t('draggable.moveToBottom') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<i18n lang="json">
{
  "en": {
    "draggable": {
      "moveToTop": "Move to top",
      "moveToBottom": "Move to bottom"
    }
  },
  "pl": {
    "draggable": {
      "moveToTop": "Przemieść na górę",
      "moveToBottom": "Przemieść na dół"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    btnClass: {
      type: String,
      default: null,
    },
    hideContextMenu: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['drag-top', 'drag-bottom'],

  methods: {
    onDragTop() {
      this.$emit('drag-top')
    },
    onDragBottom() {
      this.$emit('drag-bottom')
    },
  },
})
</script>

<style lang="scss" scoped>
.draggable-handle {
  cursor: move;
  color: $gray-color-500;
}
</style>
