<template>
  <header class="header" :class="{ 'header--hidden': isHidden }">
    <transition name="fade" mode="out-in">
      <icon-button
        v-if="returnUrl"
        reversed
        type="default"
        size="small"
        :to="returnUrl"
        class="header__return-btn"
      >
        <i slot="icon" class="bx bx-left-arrow-alt"></i>
        Wróć do listy
      </icon-button>

      <div v-else class="header__text">{{ storeName }}</div>
    </transition>

    <div v-if="user" class="header__user user">
      <div class="user__role"><i class="bx bx-user"></i> {{ userRole }}</div>

      <a-dropdown :trigger="['click']">
        <div class="user__email">{{ user.email }}</div>

        <a-menu slot="overlay">
          <a-menu-item>
            <router-link to="/settings">Ustawienia</router-link>
          </a-menu-item>
          <a-menu-item @click="logout">Wyloguj się </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import last from 'lodash/last'

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
      return last(this.user?.roles)?.name || ''
    },
  },
  methods: {
    async logout() {
      await this.$accessor.auth.logout()
      this.$router.push('/login')
    },
  },
})
</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  padding: 8px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  transition: 0.3s;

  @media ($viewport-4) {
    padding: 8px 24px;
    margin-top: 24px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__return-btn {
  }

  &--hidden {
    margin-top: -50px;
  }

  &__text {
    color: $gray-color-500;
    font-weight: 300;
    font-size: 0.9em;
  }

  @media ($max-viewport-4) {
    &__text,
    &__return-btn {
      display: none;
    }
  }

  &__user {
    margin-left: auto;
  }
}

.user {
  display: flex;
  align-items: center;

  &__role {
    background-color: #ffffff;
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
    padding: 5px 12px;
    border-radius: 10px;
    transition: 0.3s;

    &:hover {
      background-color: $primary-color-100;
    }
  }
}
</style>
