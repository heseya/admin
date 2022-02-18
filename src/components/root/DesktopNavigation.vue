<template>
  <nav class="nav" :class="{ 'nav--hidden': isHidden }">
    <nav-store-logo />

    <template v-for="(item, i) in MENU_ITEMS">
      <router-link
        v-if="item.type === 'link'"
        :key="i"
        class="nav__link"
        :to="item.to"
        :exact="item.exact"
      >
        <InlineSvg class="nav-link-img" :src="require(`@/assets/images/${item.icon}`)" />
        <span class="nav__link-label">{{ $t(item.label) }}</span>
      </router-link>

      <div v-else-if="item.type === 'spacer'" :key="i" class="nav__spacer"></div>
    </template>

    <powered-by class="nav__author" />
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import InlineSvg from 'vue-inline-svg'

import NavStoreLogo from './NavStoreLogo.vue'
import PoweredBy from './PoweredBy.vue'

import { MenuItem, MENU_ITEMS } from '@/consts/menuItems'

export default Vue.extend({
  name: 'DesktopNavigation',
  components: { NavStoreLogo, InlineSvg, PoweredBy },
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

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: $navWidth;
  padding: 9px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-right: solid 1px $background-color-600;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  transition: 0.2s;
  transition-timing-function: ease-out;

  &--hidden {
    transform: translateX(-100%);
  }

  &__spacer {
    height: 10px;
  }

  &__link {
    text-decoration: none;
    box-sizing: border-box;
    display: block;
    padding: 12px 16px;
    border-radius: 7px;
    margin-bottom: 8px;
    width: 100%;
    display: flex;
    align-items: center;
    color: #000000;
    transition: background-color 0.3s;

    .nav-link-img {
      color: #9ea5b4;
      display: block;
      width: 18px;
      height: 18px;
      margin-right: 16px;
      box-sizing: border-box;
      opacity: 0.5;
      transition: color 0.3s;
    }

    &:hover {
      background-color: $background-color-500;

      .nav-link-img {
        color: #000000;
      }
    }

    &.router-link-active {
      color: $primary-color-500;
      background-color: $primary-color-100;

      .nav-link-img {
        color: $primary-color-500;
      }
    }
  }

  &__link-label {
    display: block;
  }

  @media screen and (max-height: 700px) {
    &__author {
      margin-bottom: 10px !important;
    }

    &__link {
      padding: 8px 12px;
    }
  }

  &__author {
    margin-top: auto;
    margin-bottom: 8vh;
  }
}
</style>
