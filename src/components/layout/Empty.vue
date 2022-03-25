<template>
  <div class="empty" :class="{ 'empty--small': small }">
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
export default Vue.extend({
  props: {
    small: { type: Boolean, default: false },
  },
})
</script>

<style lang="scss">
$color: lighten($font-color, 50%);

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 12px;

  &__icon {
    font-size: 4em;
    line-height: 1em;
    color: $color;
  }

  &__message {
    font-family: $primaryFont;
    color: $color;
    font-weight: 600;
    font-size: 1.3em;
  }

  &--small {
    font-size: 0.9rem;
    flex-direction: row;
    padding: 8px;
  }

  &--small &__icon {
    font-size: 1.4em;
    margin-right: 10px;
  }

  &--small &__message {
    font-weight: 300;
    font-size: 1em;
  }
}
</style>
