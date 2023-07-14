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
        <template #icon>
          <i class="bx bx-left-arrow-alt"></i>
        </template>
        {{ $t('back') }}
      </icon-button>

      <div v-else class="header__text">{{ storeName }}</div>
    </transition>

    <div class="header__right-side">
      <div v-if="user" class="header__user user">
        <div class="user__role"><i class="bx bx-user"></i> {{ userRole }}</div>

        <a-dropdown :trigger="['click']">
          <div class="user__email">{{ user.email }}</div>

          <template #overlay>
            <header-menu />
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>

<i18n lang="json">
{
  "pl": {
    "back": "Wróć do listy"
  },
  "en": {
    "back": "Return to list"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import last from 'lodash/last'
import { User } from '@heseya/store-core'

import HeaderMenu from './HeaderMenu.vue'

export default defineComponent({
  name: 'AppHeader',
  components: { HeaderMenu },
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
    storeName(): string {
      return this.$accessor.config.env.store_name
    },
    returnUrl(): string | null {
      const previousRoute: { path: string; fullPath: string } | null = JSON.parse(
        window.sessionStorage.getItem('previousRoute') ?? 'null',
      )
      const returnUrl = this.$route.meta?.returnUrl || null
      // If the previous route match the return url, then return previous full route path cause it's also includes the query params
      // Otherwise simply return the return url
      return previousRoute?.path === returnUrl ? previousRoute?.fullPath : returnUrl
    },
    user(): User | null {
      return this.$accessor.auth.user
    },
    userRole(): string {
      return last(this.user?.roles)?.name || ''
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

  &__right-side {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
  }

  &--hidden {
    margin-top: -50px;
  }

  &__text {
    color: var(--gray-color-500);
    font-weight: 300;
    font-size: 0.9em;
  }

  &__lang-select {
    margin-right: 8px;

    ::v-deep .app-input {
      margin-bottom: 0;
    }
  }

  @media ($max-viewport-4) {
    &__text,
    &__return-btn {
      display: none;
    }
  }
}

.user {
  display: flex;
  align-items: center;

  &__role {
    background-color: var(--white-color);
    padding: 4px 8px;
    border-radius: 20px;
    color: var(--primary-color-500);
    border: solid 1px var(--background-color-600);
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
      background-color: var(--primary-color-100);
    }
  }
}
</style>
