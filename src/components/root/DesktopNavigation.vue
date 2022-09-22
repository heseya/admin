<template>
  <nav class="nav" :class="{ 'nav--hidden': isHidden }">
    <nav-store-logo />
    <div class="nav__wrapper">
      <template v-for="(item, i) in menu">
        <router-link
          v-if="item.type === MenuItemType.Link"
          :key="i"
          class="nav__link"
          :to="item.to"
          :exact="item.exact"
        >
          <InlineSvg
            v-if="item.svgIconPath"
            class="nav-link-img"
            :src="require(`@/assets/images/${item.svgIconPath}`)"
          />
          <img v-else-if="item.iconPath" :src="item.iconPath" class="nav-link-img" />
          <i v-else :class="item.iconClass" class="nav-link-svg" />
          <span class="nav__link-label">{{ $t(item.label) }}</span>
        </router-link>
        <div v-else-if="item.type === MenuItemType.Spacer" :key="i" class="nav__spacer"></div>
      </template>
    </div>

    <powered-by class="nav__author" />
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import InlineSvg from 'vue-inline-svg'

import NavStoreLogo from './NavStoreLogo.vue'
import PoweredBy from './PoweredBy.vue'

import { MenuItem, MenuItemType } from '@/consts/menuItems'

export default Vue.extend({
  name: 'DesktopNavigation',
  components: { NavStoreLogo, InlineSvg, PoweredBy },
  computed: {
    MenuItemType(): typeof MenuItemType {
      return MenuItemType
    },
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
    menu(): MenuItem[] {
      return this.$accessor.menuItems.activeItems
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
  background-color: var(--white-color);
  border-right: solid 1px var(--background-color-600);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  transition: 0.2s;
  transition-timing-function: ease-out;

  &__wrapper {
    width: 100%;
    overflow-y: auto;
  }

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
    color: var(--black-color);
    transition: background-color 0.3s;

    .nav-link-img {
      color: var(--gray-color-500);
      display: block;
      width: 18px;
      height: 18px;
      margin-right: 16px;
      line-height: 21px;
      box-sizing: border-box;
      opacity: 0.5;
      transition: color 0.3s;
    }

    .nav-link-svg {
      @extend .nav-link-img;
      font-size: 18px;
    }

    &:hover {
      background-color: var(--background-color-500);

      .nav-link-img {
        color: var(--black-color);
      }
    }

    &.router-link-active {
      color: var(--primary-color-500);
      background-color: var(--primary-color-100);

      .nav-link-img {
        color: var(--primary-color-500);
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
