<template>
  <div class="order-buyer">
    <img v-if="avatarUrl" :src="avatarUrl" role="presentation" class="order-buyer__avatar" />
    <span class="order-buyer__name">{{ buyer.name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { App, User } from '@heseya/store-core'

export default defineComponent({
  props: {
    buyer: {
      type: Object,
      required: true,
    } as Vue.PropOptions<User | App>,
  },

  computed: {
    avatarUrl(): string {
      return (this.buyer as User).avatar || (this.buyer as App).icon || ''
    },
  },
})
</script>

<style lang="scss" scoped>
.order-buyer {
  display: flex;
  align-items: center;
  margin-top: 6px;

  &__avatar {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 8px;
  }

  &__name {
    font-weight: 500;
  }
}
</style>
