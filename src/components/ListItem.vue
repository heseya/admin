<template>
  <router-link :to="url" class="list__item">
    <div v-if="!!$slots.avatar" class="list__item__avatar">
      <vs-avatar dark>
        <slot name="avatar"></slot>
      </vs-avatar>
    </div>
    <div>
      <i v-if="hidden" class="bx bx-lock-alt"></i>
      <slot></slot>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    url: String,
    hidden: Boolean
  }
}
</script>

<style lang="scss">
.list__item {
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
}

@media (hover: hover) and (pointer: fine) {
  .list__item:hover {
    background-color: none;
  }
}
</style>
