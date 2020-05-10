<template>
  <component :is="component" :to="url" class="list-item" @click="click">
    <div v-if="!!$slots.avatar" class="list-item__avatar">
      <vs-avatar dark>
        <slot name="avatar"></slot>
      </vs-avatar>
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
export default {
  props: {
    url: String,
    hidden: Boolean
  },
  computed: {
    component () {
      if (this.url) return 'router-link'
      else return 'button'
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.list-item {
  all: unset;
  font-family: $font-main;
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

  small {
    display: block;
    color: #aaa;
  }

  &__avatar {
    margin-right: 13px;
  }

  &__action {
    margin-left: auto;
  }
}

@media (hover: hover) and (pointer: fine) {
  .list__item:hover {
    background-color: none;
  }
}
</style>
