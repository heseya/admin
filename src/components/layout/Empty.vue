<template>
  <div class="empty">
    <div class="empty__icon">
      <slot name="icon">
        <i class="bx bx-box"></i>
      </slot>
    </div>
    <div class="empty__message">
      <slot> {{ $t('common.defaultEmpty') }} </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss">
$color: lighten($font-color, 50%);

.empty {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 12px;

  &__icon {
    font-size: 3em;
    line-height: 1em;
    color: $color;
  }

  &__message {
    font-family: $primaryFont;
    color: $color;
    font-weight: 300;
    font-style: italic;
    font-size: 1em;
  }
}
</style>
