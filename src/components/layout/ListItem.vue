<template>
  <component
    :is="component"
    :to="url"
    class="list-item"
    :class="{ 'list-item--no-hover': noHover }"
    @click="click"
  >
    <div v-if="!!$slots.avatar" class="list-item__avatar">
      <slot name="avatar"></slot>
    </div>
    <div>
      <i v-if="hidden" class="bx bx-lock-alt"></i>
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
      required: true,
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
  all: unset;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 20px;
  padding: 15px 20px;
  min-height: 44px;
  font-family: $font-sec;
  font-size: 17px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;

  &:hover {
    background-color: $grey-light;
  }

  &--no-hover:hover {
    background-color: #fff0;
    cursor: default;
  }

  small {
    display: block;
    color: #aaa;

    b {
      color: #666;
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
    background-color: #fff0;
  }
}
</style>
