<template>
  <nav class="nav" :class="{ 'nav--hidden': isVisible }">
    <router-link class="nav__link" to="/">
      <img class="icon" src="/img/icons/home.svg" />
      <span class="label animated faster fadeInLeft">Strona główna</span>
    </router-link>

    <router-link class="nav__link" to="/products">
      <img class="icon" src="/img/icons/products.svg" />
      <span class="label animated faster fadeInLeft">Asortyment</span>
    </router-link>

    <router-link class="nav__link" to="/orders">
      <img class="icon" src="/img/icons/orders.svg" />
      <span class="label animated faster fadeInLeft">Zamówienia</span>
    </router-link>

    <router-link class="nav__link" to="/items">
      <img class="icon" src="/img/icons/box.svg" />
      <span class="label animated faster fadeInLeft">Magazyn</span>
    </router-link>

    <router-link class="nav__link" to="/discounts">
      <img class="icon" src="/img/icons/coupon.svg" />
      <span class="label animated faster fadeInLeft">Kody rabatowe</span>
    </router-link>

    <router-link class="nav__link" to="/settings">
      <img class="icon" src="/img/icons/settings.svg" />
      <span class="label animated faster fadeInLeft">Ustawienia</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  computed: {
    isVisible() {
      return this.$route.meta.hiddenNav
    }
  }
}
</script>

<style lang="scss">
.nav {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  width: calc(100% - 30px);
  padding: 0 15px;
  background: #fff;
  box-shadow: $shadow;
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
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
      width: 42%;
      padding: 29%;
    }

    .label {
      font-family: $font-sec;
      display: none;
      font-size: 20px;
      padding: 17px 10px;
      color: #000;
    }
  }
}

@media (min-width: $break) {
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    height: calc(100vh - 120px);
    width: 60px;
    padding: 0;
    padding-top: 120px;
    border-top-left-radius: 0;
    border-top-right-radius: 26px;
    border-bottom-right-radius: 26px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    transition: 0.15s;
    transition-timing-function: ease-out;

    &--hidden {
      transform: translateX(-100px);
    }

    &__link {
      border-radius: 12px;

      &:hover {
        background-color: $grey-light;
      }

      img {
        padding: 29%;
      }
    }
  }

  .nav:hover {
    width: 250px;

    .nav__link {
      width: 250px;
      display: grid;
      grid-template-columns: 60px 190px;
    }

    .label {
      display: inline-block;
      animation-name: fadeInRight;
      animation-duration: 0.5s;
      animation-fill-mode: both;
    }
  }
}

@media (hover: hover) and (pointer: fine) {
  .nav__link:hover {
    background-color: none;
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(-14%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
