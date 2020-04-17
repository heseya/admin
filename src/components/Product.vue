<template>
  <router-link :to="`products/${product.id}`" class="product-box">
    <div class="product-box__img">
      <img v-if="product.cover !== null" :src="product.cover.url" />
    </div>
    <div class="flex">
      <div class="name">
        {{ product.name }}<br/>
        <small>{{ product.price }} zł</small>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    product: Object
  }
}
</script>

<style lang="scss">
.product-box {
  color: #000;
  text-decoration: none;

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
      width: 100%;
      height: 100%;
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
