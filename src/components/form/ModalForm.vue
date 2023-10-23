<template>
  <div class="modal-form">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ModalForm',
})
</script>

<style lang="scss">
.modal-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  .center {
    display: flex;
    justify-content: center;
    align-items: center;

    > *:not(:first-child) {
      margin-left: 12px;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;

    > * {
      width: 100%;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
