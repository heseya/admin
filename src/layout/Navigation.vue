<template>
  <nav class="nav">

    <router-link class="nav__link" to="/products">
      <img class="icon" src="/img/icons/products.svg">
      <span class="label animated faster fadeInLeft">Asortyment</span>
    </router-link>

    <router-link class="nav__link" to="/orders">
      <img class="icon" src="/img/icons/orders.svg">
      <span class="label animated faster fadeInLeft">Zamówienia</span>
    </router-link>

    <router-link class="nav__link" to="/chat">
      <img class="icon" src="/img/icons/chat.svg">
      <span class="label animated faster fadeInLeft">Konwersajce</span>
    </router-link>

    <router-link class="nav__link" to="/pages">
      <img class="icon" src="/img/icons/copy.svg">
      <span class="label animated faster fadeInLeft">Strony</span>
    </router-link>

    <router-link class="nav__link" to="/settings">
      <img class="icon" src="/img/icons/settings.svg">
      <span class="label animated faster fadeInLeft">Ustawienia</span>
    </router-link>

  </nav>
</template>

<style lang="scss">
.nav {
  z-index: 10;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 60px;
  width: calc(100% - 30px);
  padding: 0 15px;
  background: #fff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
  display: flex;
  justify-content: space-around;
  align-items: center;

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
    z-index: 10;
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

    .nav__link {
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
    }
  }
}
</style>
