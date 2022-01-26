<template>
  <div>
    <div class="mobile-nav" :class="{ 'mobile-nav--hidden': isHidden }">
      <menu-link
        v-for="item in MENU_ITEMS"
        :key="item.to"
        v-can="item.can"
        :to="item.to"
        :exact="item.exact"
        :label="item.label"
        :icon="item.icon"
        root-class="mobile-nav"
      />

      <menu-link
        root-class="mobile-nav"
        class="mobile-nav__more-btn"
        icon="icons/more-icon.svg"
        :label="$t('more')"
        @click="isMenuVisible = true"
      />
    </div>

    <mobile-overlay :is-visible="isMenuVisible" @close="isMenuVisible = false" />
  </div>
</template>

<i18n>
{
  "pl": {
    "moreLink": "Więcej"
  },
  "en": {
    "moreLink": "More"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import MenuLink from './MenuLink.vue'
import MobileOverlay from './MobileOverlay.vue'
import { MenuItem, MENU_ITEMS } from '@/consts/menuItems'

export default Vue.extend({
  name: 'MobileNavigation',
  components: { MobileOverlay, MenuLink },
  data: () => ({
    isMenuVisible: false,
  }),
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
    MENU_ITEMS(): MenuItem[] {
      return MENU_ITEMS
    },
  },
})
</script>

<style lang="scss">
.mobile-nav {
  z-index: $mobile-nav-z-index;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  box-sizing: border-box;
  width: 100vw;
  background: #ffffff;
  border-top: solid 1px $primary-color-100;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  justify-content: space-around;
  align-items: center;
  transition: 0.3s;

  &--hidden {
    transform: translateY(60px);
  }

  &__link {
    all: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    padding: 4px 12px;
    border-radius: 8px;

    .nav-link-img {
      color: #9ea5b4;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
    }

    &.router-link-active {
      color: $primary-color-500;

      .nav-link-img {
        color: $primary-color-500;
      }
    }
  }

  &__link-label {
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
  }

  &__more-btn {
    grid-column: -2/-1;
    grid-row: 1/2;

    @media (min-width: 770px) {
      display: none;
    }
  }
}
</style>
