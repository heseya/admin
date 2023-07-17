<template>
  <div class="header-menu">
    <ApiLangSwitch class="header-menu__lang-select" />

    <router-link class="header-menu__item" to="/settings">
      <i class="header-menu__item-icon bx bx-cog"></i> {{ $t('settings') }}
    </router-link>

    <button class="header-menu__item" @click="logout">
      <i class="header-menu__item-icon bx bx-power-off"></i> {{ $t('logout') }}
    </button>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "settings": "Ustawienia",
    "logout": "Wyloguj się"
  },
  "en": {
    "settings": "Settings",
    "logout": "Log out"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import ApiLangSwitch from '../ApiLangSwitch.vue'

export default defineComponent({
  components: { ApiLangSwitch },

  methods: {
    async logout() {
      await this.$accessor.auth.logout()
      this.$router.push('/login')
    },
  },
})
</script>

<style lang="scss" scoped>
.header-menu {
  display: flex;
  width: 200px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-color: #fff;
  box-shadow: 0px 5px 10px #0000001c;
  border-radius: 3px;

  &__lang-select {
    width: 100%;
  }

  &__item {
    all: unset;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $font-color;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 1px;
    padding: 8px;
    transition: 0.3s;

    &:hover {
      background-color: $gray-color-200;
      color: $primary-color-500;
    }
  }

  &__item-icon {
    display: block;
    margin-right: 8px;
    font-size: 1.6em;
    color: #9ea5b4;
  }
}
</style>
