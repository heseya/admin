<template>
  <div>
    <div class="mobile-nav" :class="{ 'mobile-nav--hidden': isHidden }">
      <router-link class="mobile-nav__link" to="/">
        <img src="/img/icons/home.svg" />
        <span class="mobile-nav__link-label">Dashboard</span>
      </router-link>

      <router-link v-can="$p.Orders.Show" class="mobile-nav__link" to="/orders">
        <img src="/img/icons/orders.svg" />
        <span class="mobile-nav__link-label">Zamówienia</span>
      </router-link>

      <router-link class="mobile-nav__link" to="/">
        <img src="/img/icons/home.svg" />
        <span class="mobile-nav__link-label">Statystyka</span>
      </router-link>

      <button class="mobile-nav__link" @click="isMenuVisible = true">
        <img src="/img/icons/settings.svg" />
        <span class="mobile-nav__link-label">Więcej</span>
      </button>
    </div>

    <div class="mobile-nav-overlay" :class="{ 'mobile-nav-overlay--visible': isMenuVisible }">
      <button class="mobile-nav-overlay__close" @click="isMenuVisible = false">X</button>

      <router-link class="mobile-nav-overlay__link" to="/">
        <img src="/img/icons/home.svg" />
        <span class="mobile-nav-overlay__link-label">Statystyka</span>
      </router-link>

      <router-link v-can.hide="$p.Products.Show" class="mobile-nav-overlay__link" to="/products">
        <img src="/img/icons/products.svg" />
        <span class="mobile-nav-overlay__link-label">Produkty</span>
      </router-link>

      <router-link
        v-can.hide="$p.Products.Show"
        class="mobile-nav-overlay__link"
        to="/settings/product-sets"
      >
        <img src="/img/icons/products.svg" />
        <span class="mobile-nav-overlay__link-label">Kolekcje</span>
      </router-link>

      <router-link v-can.hide="$p.Items.Show" class="mobile-nav-overlay__link" to="/items">
        <img src="/img/icons/box.svg" />
        <span class="mobile-nav-overlay__link-label">Magazyn</span>
      </router-link>

      <router-link v-can.hide="$p.Discounts.Show" class="mobile-nav-overlay__link" to="/discounts">
        <img src="/img/icons/coupon.svg" />
        <span class="mobile-nav-overlay__link-label">Kody rabatowe</span>
      </router-link>

      <router-link class="mobile-nav-overlay__link" to="/settings">
        <img src="/img/icons/settings.svg" />
        <span class="mobile-nav-overlay__link-label">Ustawienia</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Navigation',
  data: () => ({
    isMenuVisible: false,
  }),
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
  },
})
</script>

<style lang="scss" scoped>
.mobile-nav {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border-top: solid 1px $backgroundAccentColor;
  display: flex;
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

    &.router-link-exact-active {
      color: $primaryColor;
    }

    img {
      width: 20px;
      opacity: 0.5;
      box-sizing: border-box;
    }

    &.router-link-exact-active img {
      opacity: 1;
    }
  }

  &__link-label {
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
  }
}

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
    background-color: #eceef5;
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

    img {
      width: 16px;
      margin-right: 20px;
      box-sizing: border-box;
      opacity: 0.5;
      transition: opacity 0.3s;

      @media ($viewport-3) {
        width: 22px;
        margin-right: 30px;
      }
    }

    &.router-link-exact-active {
      color: $primaryColor;

      img {
        opacity: 1;
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
