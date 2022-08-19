<template>
  <div class="empty" :class="{ 'empty--small': small }">
    <div class="empty__icon">
      <slot name="icon"> </slot>
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
.empty {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px #d9dbe0;
  border-radius: 4px;
  padding: 16px 12px;
  margin: 8px 0;
  color: #7b8589;

  &__icon {
    font-size: 3em;
    line-height: 1em;
    color: inherit;
  }

  &__message {
    font-family: $primaryFont;
    color: inherit;
    font-weight: 300;
    font-size: 0.9em;
    letter-spacing: 0.55px;
  }

  &--small {
    font-size: 0.8rem;
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
