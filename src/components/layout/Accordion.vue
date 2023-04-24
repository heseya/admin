<template>
  <a-collapse accordion :bordered="false" class="accordion" :class="{ 'accordion--white': white }">
    <template #expandIcon="{ isActive }">
      <div>
        <i :class="`bx ${isActive ? 'bx-chevron-up' : 'bx-chevron-down'}`"></i>
      </div>
    </template>

    <a-collapse-panel>
      <template #header>
        <span class="accordion__title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
      </template>

      <slot></slot>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
    white: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
.accordion {
  margin-bottom: 8px;

  &--white .ant-collapse-item {
    background-color: var(--white-color);
  }

  &__title {
    font-weight: 600;
  }
}
</style>
