<template>
  <div class="mobile-nav-overlay" :class="{ 'mobile-nav-overlay--visible': isVisible }">
    <button class="mobile-nav-overlay__close" @click="close">
      <img src="@/assets/images/icons/close-icon.svg" alt="Close" />
    </button>

    <router-link class="mobile-nav-overlay__link" to="/analytics" @click.native="close">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/stats-icon.svg')" />
      <span class="mobile-nav-overlay__link-label">Statystyka</span>
    </router-link>

    <router-link
      v-can.hide="$p.Products.Show"
      class="mobile-nav-overlay__link"
      to="/products"
      @click.native="close"
    >
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/products-icon.svg')" />
      <span class="mobile-nav-overlay__link-label">Produkty</span>
    </router-link>

    <router-link
      v-can.hide="$p.Products.Show"
      class="mobile-nav-overlay__link"
      to="/settings/product-sets"
      @click.native="close"
    >
      <InlineSvg
        class="nav-link-img"
        :src="require('@/assets/images/icons/collections-icon.svg')"
      />
      <span class="mobile-nav-overlay__link-label">Kolekcje</span>
    </router-link>

    <router-link
      v-can.hide="$p.Items.Show"
      class="mobile-nav-overlay__link"
      to="/items"
      @click.native="close"
    >
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/warehouse-icon.svg')" />
      <span class="mobile-nav-overlay__link-label">Magazyn</span>
    </router-link>

    <router-link
      v-can.hide="$p.Discounts.Show"
      class="mobile-nav-overlay__link"
      to="/discounts"
      @click.native="close"
    >
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/discounts-icon.svg')" />
      <span class="mobile-nav-overlay__link-label">Kody rabatowe</span>
    </router-link>

    <router-link class="mobile-nav-overlay__link" to="/settings" @click.native="close">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/settings-icon.svg')" />
      <span class="mobile-nav-overlay__link-label">Ustawienia</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import InlineSvg from 'vue-inline-svg'

export default Vue.extend({
  name: 'Navigation',
  components: { InlineSvg },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss" scoped>
.mobile-nav-overlay {
  position: fixed;
  top: 102vh;
  left: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 20vh 10% 0;
  background-color: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    color: #000;
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
