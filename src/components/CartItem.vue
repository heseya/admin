<template>
  <div class="cart-item">
    <img class="cart-item__cover" :src="coverUrl" />
    <div class="cart-item__content">
      <span>
        {{ item.product.brand.name }} {{ item.product.name }}&nbsp;<small v-if="item.quantity !== 1">(x{{ item.quantity }})</small>
      </span>
      <small v-for="schema in item.schemas" :key="schema.id">
        <span>{{ schema.name }}:</span> {{ schema.value }}
        <small v-if="schema.price !== 0">(+ {{ schema.price }} {{ currency }})</small>
      </small>
    </div>
    <span class="cart-item__price">{{ item.price }} {{ currency }}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    coverUrl() {
      return this.item?.product?.cover?.url
    },
    currency() {
      return this.$store.state.currency
    },
  },
}
</script>

<style lang="scss">
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
    background-color: #eee;
    text-indent: -10000px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 12px;

    small {
      color: #aaa;

      span {
        color: #333;
      }

      small {
        color: #ccc;
      }
    }
  }

  &__price {
    display: flex;
    justify-content: center;
    // align-items: center;
    margin-left: auto;
    font-family: $font-sec;
  }
}
</style>
