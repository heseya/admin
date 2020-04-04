<template>
  <route-link to="/products/${product.id}" class="product">
    <div class="product__img">
      <img :src="product.img" />
    </div>
    <div class="flex">
      <div class="name">
        {{ product.name }}<br/>
        <small>{{ product.price }}</small>
      </div>
    </div>
  </route-link>
</template>

<script>
export default {
  props: {
    product: Object
  }
}
</script>

<style lang="scss">
.product {

  &__img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 20px;
    background-color: $grey-light;
    overflow: hidden;
    margin-bottom: 4px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);

    img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }
  }

  .name {
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
