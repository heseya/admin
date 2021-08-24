<template>
  <nav class="nav" :class="{ 'nav--hidden': isHidden }">
    <router-link class="nav__link" to="/">
      <img src="/img/icons/home.svg" />
      <span class="label animated faster fadeInLeft">Strona główna</span>
    </router-link>

    <router-link v-can="$p.Products.Show" class="nav__link" to="/products">
      <img src="/img/icons/products.svg" />
      <span class="label animated faster fadeInLeft">Asortyment</span>
    </router-link>

    <router-link v-can="$p.Orders.Show" class="nav__link" to="/orders">
      <img src="/img/icons/orders.svg" />
      <span class="label animated faster fadeInLeft">Zamówienia</span>
    </router-link>

    <router-link v-can="$p.Items.Show" class="nav__link" to="/items">
      <img src="/img/icons/box.svg" />
      <span class="label animated faster fadeInLeft">Magazyn</span>
    </router-link>

    <router-link v-can="$p.Discounts.Show" class="nav__link" to="/discounts">
      <img src="/img/icons/coupon.svg" />
      <span class="label animated faster fadeInLeft">Kody rabatowe</span>
    </router-link>

    <router-link class="nav__link" to="/settings">
      <img src="/img/icons/settings.svg" />
      <span class="label animated faster fadeInLeft">Ustawienia</span>
    </router-link>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Navigation',
  computed: {
    isHidden(): boolean {
      return !!this.$route.meta?.hiddenNav || false
    },
  },
})
</script>

<style lang="scss" scoped>
.nav {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  box-sizing: border-box;
  width: 100%;
  padding: 0 15px;
  background: #fff;
  border-top: solid 1px $backgroundAccentColor;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: 0.3s;

  &--hidden {
    transform: translateY(60px);
  }

  .nav__link {
    text-decoration: none;
    display: block;
    height: 60px;
    width: 60px;
    border-radius: 12px;

    &:hover {
      background-color: $grey-light;
    }

    img {
      width: 60px;
      padding: 17px;
      box-sizing: border-box;
    }

    .label {
      font-family: $font-sec;
      display: block;
      animation-name: fadeInRight;
      animation-duration: 0.5s;
      animation-fill-mode: both;
      font-size: 20px;
      padding: 17px 10px;
      color: #000;
    }
  }
}
</style>
