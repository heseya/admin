<template>
  <router-link :to="`products/${product.id}`" class="product-box">
    <vs-avatar size="30" class="product-box__icon" color="#000" v-if="!product.visible">
      <i class="bx bx-lock-alt"></i>
    </vs-avatar>
    <div class="product-box__img">
      <img v-if="product.cover" :src="`${product.cover.url}?w=250&h=100`" :style="{ objectFit }" />
      <i v-else class="product-box__img-icon bx bx-image"></i>
    </div>
    <div class="flex">
      <div class="name">
        {{ product.name }}<br />
        <small>{{ product.price }} {{ currency }}</small>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    product: Object,
  },
  computed: {
    currency() {
      return this.$store.state.currency
    },
    objectFit() {
      return this.$store.state.env.DASHBOARD_PRODUCTS_CONTAIN ? 'contain' : 'cover'
    },
  },
}
</script>

<style lang="scss">
.product-box {
  color: #000;
  text-decoration: none;
  position: relative;

  &__icon {
    position: absolute;
    top: -10px;
    left: -10px;
  }

  &__img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 20px;
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 4px;
    box-shadow: $shadow;

    img {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  &__img-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    color: #ccc;

    &::after {
      content: '';
      display: block;
      width: 120%;
      height: 2px;
      background-color: firebrick;
      position: absolute;
      top: 50%;
      left: -10%;
      transform: rotate(-45deg);
    }
  }

  .name {
    font-family: $font-sec;
    padding: 5px;
    padding-bottom: 2px;
  }

  small {
    color: #777;
  }

  .price {
    padding: 5px 5px 0 0;
  }
}
</style>
