<template>
  <header class="header" :class="{ 'header--hidden': isHidden }">
    <transition name="fade">
      <router-link v-if="returnUrl" :to="returnUrl" class="header__return-btn">
        <img src="@/assets/images/icons/close-icon.svg" alt="Close" />
        Wróć do listy
      </router-link>
      <div v-else class="header__text">{{ storeName }}</div>
    </transition>

    <div v-if="user" class="header__user user">
      <div class="user__role">{{ userRole }}</div>
      <div class="user__email">{{ user.email }}</div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { User } from '@/interfaces/User'

export default Vue.extend({
  name: 'AppHeader',
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
    storeName(): string {
      return this.$accessor.env.store_name
    },
    returnUrl(): string | null {
      return this.$route.meta?.returnUrl || null
    },
    user(): User | null {
      return this.$accessor.auth.user
    },
    userRole(): string {
      return this.user?.roles[0]?.name || ''
    },
  },
})
</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  padding: 8px 24px;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;

  &__return-btn {
    color: #979ea0;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 300;
    font-size: 0.9em;
    padding-right: 16px;
    border-radius: 20px;
    transition: 0.3s;

    &:hover {
      background-color: $background-color-700;
    }

    img {
      all: unset;
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $background-color-700;
      margin-right: 6px;
    }
  }

  &--hidden {
    margin-top: -50px;
  }

  &__text {
    color: $gray-color-500;
    font-weight: 300;
    font-size: 0.9em;
  }
}

.user {
  display: flex;
  align-items: center;

  &__role {
    background-color: #fff;
    padding: 4px 8px;
    border-radius: 20px;
    color: $primary-color-500;
    border: solid 1px $background-color-600;
    font-size: 0.8em;
    margin-right: 4px;
  }

  &__email {
    font-size: 0.9em;
    line-height: 1em;
    cursor: pointer;
    padding: 3px 12px 5px;
    border-radius: 10px;
    transition: 0.3s;

    &:hover {
      background-color: $primary-color-200;
    }
  }
}
</style>
