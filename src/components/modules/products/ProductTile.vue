<template>
  <button @click="onClick" class="product-box">
    <vs-avatar size="30" class="product-box__icon" color="#000" v-if="!product.visible">
      <i class="bx bx-lock-alt"></i>
    </vs-avatar>
    <div class="product-box__img">
      <img v-if="product.cover" :src="`${product.cover.url}?w=350&h=350`" :style="{ objectFit }" />
      <i v-else class="product-box__img-icon bx bx-image"></i>

      <div class="product-box__tags">
        <div
          class="product-box__tag"
          :style="{ backgroundColor: `#${tag.color}` }"
          v-for="tag in product.tags"
          :key="tag.id"
        >
          {{ tag.name }}
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="name">
        {{ product.name }}<br />
        <small>{{ product.price }} {{ currency }}</small>
      </div>
    </div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    product: Object,
  },
  computed: {
    currency(): string {
      return this.$store.state.currency
    },
    objectFit(): string {
      return +this.$store.state.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
  methods: {
    onClick() {
      // @ts-ignore
      if (window.copyIdMode === true) {
        this.copyId()
        return
      }

      this.$router.push(`products/${this.product.id}`)
    },
    async copyId() {
      await navigator.clipboard.writeText(this.product.id)
      this.$vs.notification({
        color: 'success',
        title: 'Skopiowano id',
      })
    },
  },
  mounted() {
    navigator.permissions.query({ name: 'clipboard-write' })
  },
})
</script>

<style lang="scss">
.product-box {
  all: unset;
  color: #000;
  text-decoration: none;
  position: relative;
  cursor: pointer;

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
      transition: transform 0.3s;
    }
  }

  &__tags {
    position: absolute;
    right: 10px;
    bottom: 10px;
    max-width: calc(100% - 20px);
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  &__tag {
    display: inline-block;
    margin-right: 3px;
    margin-top: 3px;
    background-color: #000;
    padding: 3px 6px;
    color: #fff;
    font-size: 0.7em;
    border-radius: 3px;
  }

  &:hover &__img img {
    transform: scale(1.05);
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