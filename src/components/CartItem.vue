<template>
  <div class="cart-item">
    <img class="cart-item__cover" :src="item.product.cover.url" />
    <div class="cart-item__content">
      <span>
        {{ item.product.name }}&nbsp;<small>(x{{ item.quantity }})</small>
      </span>
      <small>{{ item.price }} {{ currency }}</small>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    currency() {
      return this.$store.state.currency
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-item {
  margin: 8px 0;
  padding: 12px;
  border-radius: 12px;
  transition: 0.3s;
  display: flex;

  &__cover {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 12px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 12px;
  }

  &:hover {
    background-color: #fafafa;
  }
}
</style>
