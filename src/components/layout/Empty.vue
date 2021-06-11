<template>
  <div class="empty">
    <div class="empty__icon">
      <slot name="icon">
        <i class="bx bx-box"></i>
      </slot>
    </div>
    <div class="empty__message">
      <slot> Nic tutaj nie ma </slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 12px;

  &__icon {
    font-size: 3em;
    margin-bottom: 12px;
    color: #aaa;
  }

  &__message {
    font-family: $font-sec;
    font-size: 1.2em;
  }
}
</style>
