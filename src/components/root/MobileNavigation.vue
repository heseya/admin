<template>
  <div>
    <div class="mobile-nav" :class="{ 'mobile-nav--hidden': isHidden }">
      <menu-link
        v-for="item in MENU_LINKS"
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
        label="nav.moreLink"
        @click="isMenuVisible = true"
      />
    </div>

    <mobile-overlay :is-visible="isMenuVisible" @close="isMenuVisible = false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import MenuLinkComponent from './MenuLink.vue'
import MobileOverlay from './MobileOverlay.vue'
import { MenuLink, MENU_LINKS } from '@/consts/menuItems'

export default Vue.extend({
  name: 'MobileNavigation',
  components: { MobileOverlay, MenuLink: MenuLinkComponent },
  data: () => ({
    isMenuVisible: false,
  }),
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
    MENU_LINKS(): MenuLink[] {
      return MENU_LINKS
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
