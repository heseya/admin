<template>
  <nav class="nav" :class="{ 'nav--hidden': isHidden }">
    <nav-store-logo />

    <router-link class="nav__link" to="/">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/dashboard-icon.svg')" />
      <span class="nav__link-label">Dashboard</span>
    </router-link>

    <div class="nav__spacer"></div>

    <router-link v-can.hide="$p.Orders.Show" class="nav__link" to="/orders">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/orders-icon.svg')" />
      <span class="nav__link-label">Zamówienia</span>
    </router-link>

    <div class="nav__spacer"></div>

    <router-link class="nav__link" to="/stats">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/stats-icon.svg')" />
      <span class="nav__link-label">Statystyka</span>
    </router-link>

    <router-link v-can.hide="$p.Products.Show" class="nav__link" to="/products">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/products-icon.svg')" />
      <span class="nav__link-label">Produkty</span>
    </router-link>

    <router-link v-can.hide="$p.Products.Show" class="nav__link" to="/settings/product-sets">
      <InlineSvg
        class="nav-link-img"
        :src="require('@/assets/images/icons/collections-icon.svg')"
      />
      <span class="nav__link-label">Kolekcje</span>
    </router-link>

    <router-link v-can.hide="$p.Items.Show" class="nav__link" to="/items">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/warehouse-icon.svg')" />
      <span class="nav__link-label">Magazyn</span>
    </router-link>

    <router-link v-can.hide="$p.Discounts.Show" class="nav__link" to="/discounts">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/discounts-icon.svg')" />
      <span class="nav__link-label">Kody rabatowe</span>
    </router-link>

    <div class="nav__spacer"></div>

    <router-link class="nav__link" to="/settings">
      <InlineSvg class="nav-link-img" :src="require('@/assets/images/icons/settings-icon.svg')" />
      <span class="nav__link-label">Ustawienia</span>
    </router-link>

    <div class="nav__author nav-author">
      <span class="nav-author__title">Powered by</span>
      <a href="https://heseya.com" target="_blank">
        <img src="@/assets/images/heseya.svg" alt="Heseya" class="nav-author__logo" />
      </a>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import InlineSvg from 'vue-inline-svg'
import NavStoreLogo from './NavStoreLogo.vue'

export default Vue.extend({
  name: 'Navigation',
  components: { NavStoreLogo, InlineSvg },
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
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
  background-color: #fff;
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
    color: #000;
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
        color: #000;
      }
    }

    &.router-link-exact-active {
      color: $primary-color-500;
      background-color: $primary-color-200;

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
}

.nav-author {
  width: 100%;
  margin-top: auto;
  margin-bottom: 8vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 0.8em;
    letter-spacing: -0.24px;
    color: #bec1c7;
  }

  &__logo {
    width: 130px;
  }
}
</style>
