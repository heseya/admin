<template>
  <div class="empty">
    <div class="empty__icon">
      <slot name="icon">
        <i class="bx bx-box"></i>
      </slot>
    </div>
    <div class="empty__message">
      <slot> {{ $t('defaultEmpty') }} </slot>
    </div>
  </div>
</template>

<i18n>
{
  "pl": {
    "defaultEmpty": "Nic tutaj nie ma"
  },
  "en": {
    "defaultEmpty": "Nothing here"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
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
}
</style>
