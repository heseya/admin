<template>
  <a-dropdown :trigger="isContextMenu ? ['contextmenu'] : []">
    <icon-button :class="`draggable-handle ${btnClass}`" size="small" type="transparent">
      <template #icon> <i class="bx bx-menu"></i> </template>
    </icon-button>

    <template #overlay>
      <a-menu>
        <a-menu-item v-if="isToTop" @click="onMoveToTop">
          <i class="bx bx-arrow-to-top"></i> {{ $t('menu.moveToTop') }}
        </a-menu-item>
        <a-menu-item v-if="isOneUp" @click="onMoveOneTop">
          <i class="bx bx-up-arrow-alt"></i> {{ $t('menu.moveOneUp') }}
        </a-menu-item>
        <a-menu-item v-if="isOneDown" @click="onMoveOneBottom">
          <i class="bx bx-down-arrow-alt"></i> {{ $t('menu.moveOneDown') }}
        </a-menu-item>
        <a-menu-item v-if="isToBottom" @click="onMoveToBottom">
          <i class="bx bx-arrow-to-bottom"></i> {{ $t('menu.moveToBottom') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<i18n lang="json">
{
  "en": {
    "menu": {
      "moveToTop": "Move to top",
      "moveOneUp": "Move one up",
      "moveOneDown": "Move one down",
      "moveToBottom": "Move to bottom"
    }
  },
  "pl": {
    "menu": {
      "moveToTop": "Przemieść na samą górę",
      "moveOneUp": "Przemieść jeden w górę",
      "moveOneDown": "Przemieść jeden w dół",
      "moveToBottom": "Przemieść na sam dół"
    }
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  props: {
    btnClass: {
      type: String,
      default: null,
    },
    contextMenu: {
      type: [Array, Boolean] as PropType<false | string[] | undefined>,
      default: () => ['top', 'up', 'down', 'bottom'],
    },
  },
  emits: ['move-to-top', 'move-one-up', 'move-one-down', 'move-to-bottom'],

  computed: {
    isContextMenu(): boolean {
      return !!this.contextMenu && this.contextMenu.length > 0
    },
    isToTop(): boolean {
      return !!this.contextMenu && this.contextMenu.includes('top')
    },
    isOneUp(): boolean {
      return !!this.contextMenu && this.contextMenu.includes('up')
    },
    isOneDown(): boolean {
      return !!this.contextMenu && this.contextMenu.includes('down')
    },
    isToBottom(): boolean {
      return !!this.contextMenu && this.contextMenu.includes('bottom')
    },
  },

  methods: {
    onMoveToTop() {
      this.$emit('move-to-top')
    },
    onMoveOneTop() {
      this.$emit('move-one-up')
    },
    onMoveOneBottom() {
      this.$emit('move-one-down')
    },
    onMoveToBottom() {
      this.$emit('move-to-bottom')
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
