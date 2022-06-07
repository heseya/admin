<template>
  <div class="mobile-nav-overlay" :class="{ 'mobile-nav-overlay--visible': isVisible }">
    <button class="mobile-nav-overlay__close" @click="close">
      <img src="@/assets/images/icons/close-icon.svg" :alt="$t('common.close')" />
    </button>

    <menu-link
      v-for="item in menu"
      :key="item.to"
      v-can="item.can"
      :to="item.to"
      :exact="item.exact"
      :label="item.label"
      :icon-class="item.iconClass"
      :svg-icon-path="item.svgIconPath"
      root-class="mobile-nav-overlay"
      @click.native="close"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import MenuLinkComponent from './MenuLink.vue'

export default Vue.extend({
  name: 'MobileOverlay',
  components: {
    MenuLink: MenuLinkComponent,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    menu(): any {
      // @ts-ignore // TODO: fix extended store actions typings
      return this.$accessor.menuItems.getMenuLinks
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss">
.mobile-nav-overlay {
  position: fixed;
  top: 102vh;
  left: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 20vh 10%;
  background-color: #ffffff;
  z-index: $mobile-nav-overlay-z-index;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;

  &--visible {
    top: 0;
    visibility: visible;
    opacity: 1;
  }

  &__close {
    all: unset;
    display: block;
    position: absolute;
    top: 60px;
    right: 20px;
    width: 37px;
    height: 37px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #979ea0;
    background-color: $background-color-700;
  }

  &__link {
    text-decoration: none;
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 12px 16px;
    border-radius: 7px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    color: #000000;
    transition: background-color 0.3s;

    .nav-link-img {
      width: 16px;
      height: 16px;
      color: #9ea5b4;
      margin-right: 20px;
      box-sizing: border-box;
      transition: opacity 0.3s;

      @media ($viewport-3) {
        width: 24px;
        height: 24px;
        margin-right: 30px;
      }
    }

    .nav-link-svg {
      font-size: 22px;
      line-height: 24px;
    }

    &.router-link-active {
      color: $primary-color-500;

      .nav-link-img {
        color: $primary-color-500;
      }
    }
  }

  &__link-label {
    font-size: 1.1em;

    @media ($viewport-3) {
      font-size: 1.2em;
    }
  }
}
</style>
