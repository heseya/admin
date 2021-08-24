<template>
  <nav class="nav" :class="{ 'nav--hidden': isHidden }">
    <nav-store-logo />

    <router-link class="nav__link" to="/">
      <img src="/img/icons/home.svg" />
      <span class="nav__link-label">Dashboard</span>
    </router-link>

    <div class="nav__spacer"></div>

    <router-link v-can="$p.Orders.Show" class="nav__link" to="/orders">
      <img src="/img/icons/orders.svg" />
      <span class="nav__link-label">Zamówienia</span>
    </router-link>

    <div class="nav__spacer"></div>

    <router-link class="nav__link" to="/">
      <img src="/img/icons/home.svg" />
      <span class="nav__link-label">Statystyka</span>
    </router-link>

    <router-link v-can="$p.Products.Show" class="nav__link" to="/products">
      <img src="/img/icons/products.svg" />
      <span class="nav__link-label">Produkty</span>
    </router-link>

    <router-link v-can="$p.Products.Show" class="nav__link" to="/product-sets">
      <img src="/img/icons/products.svg" />
      <span class="nav__link-label">Kolekcje</span>
    </router-link>

    <router-link v-can="$p.Items.Show" class="nav__link" to="/items">
      <img src="/img/icons/box.svg" />
      <span class="nav__link-label">Magazyn</span>
    </router-link>

    <router-link v-can="$p.Discounts.Show" class="nav__link" to="/discounts">
      <img src="/img/icons/coupon.svg" />
      <span class="nav__link-label">Kody rabatowe</span>
    </router-link>

    <div class="nav__spacer"></div>

    <router-link class="nav__link" to="/settings">
      <img src="/img/icons/settings.svg" />
      <span class="nav__link-label">Ustawienia</span>
    </router-link>

    <div class="nav__author nav-author">
      <span class="nav-author__title">Powered by</span>
      <img src="@/assets/images/heseya.svg" alt="Heseya" class="nav-author__logo" />
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import NavStoreLogo from './NavStoreLogo.vue'

export default Vue.extend({
  name: 'Navigation',
  components: { NavStoreLogo },
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
  border-right: solid 1px $backgroundAccentColor;
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

    img {
      width: 16px;
      margin-right: 22px;
      box-sizing: border-box;
      opacity: 0.8;
      transition: opacity 0.3s;
    }

    &.router-link-exact-active {
      color: $primaryColor;
      background-color: #e3f0fd;
    }

    &:hover {
      background-color: #f7f8fa;
    }

    &.router-link-exact-active img,
    &:hover img {
      opacity: 1;
    }
  }

  &__link-label {
    display: block;
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
