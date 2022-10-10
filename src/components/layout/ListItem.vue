<template>
  <component
    :is="component"
    :to="url"
    class="list-item"
    :class="{ 'list-item--no-hover': noHover }"
    @click.stop="click"
  >
    <div v-if="!!$slots.avatar" class="list-item__avatar">
      <slot name="avatar"></slot>
    </div>
    <div class="list-item__content">
      <i v-if="hidden" class="list-item__hidden-icon bx bx-low-vision"></i>
      <slot></slot>
    </div>
    <div class="list-item__action">
      <slot name="action"></slot>
    </div>
  </component>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    url: {
      type: String,
      default: null,
    },
    el: {
      type: String,
      default: 'button',
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    noHover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    component() {
      if (this.url) return 'router-link'
      return this.el
    },
  },
  methods: {
    click() {
      this.$emit('click')
    },
  },
})
</script>

<style lang="scss">
.list-item {
  border: none;
  background-color: $transparent;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 7px;
  padding: 8px 12px;
  min-height: 32px;
  display: flex !important;
  align-items: center;
  text-decoration: none;
  color: black;
  transition: 0.3s;
  text-align: left;

  &__content {
    width: 100%;
    font-weight: 600;
  }

  &__hidden-icon {
    font-size: 0.9em;
    margin-right: 6px;
  }

  &:hover {
    background-color: var(--primary-color-100);
    color: black;
  }

  &--no-hover:hover {
    background-color: $transparent;
    cursor: default;
  }

  small {
    display: block;
    color: var(--gray-color-400);

    b {
      color: var(--gray-color-600);
    }
  }

  &__avatar {
    margin-right: 13px;
  }

  &__action {
    margin-left: auto;
    text-align: right;
  }
}

@media (hover: hover) and (pointer: fine) {
  .list__item:hover {
    background-color: var(--white-color);
  }
}
</style>
