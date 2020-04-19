<template>
  <div class="modal-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ModalForm'
}
</script>

<style lang="scss">
.modal-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  .vs-input-parent {
    margin-bottom: 32px;
  }

  .vs-input-parent,
  .vs-input {
    width: 100%;
  }

  .center {
    display: flex;
    justify-content: center;
  }
}
</style>
