<template>
  <button class="product-box" @click="onClick">
    <avatar v-if="!product.visible" small class="product-box__icon">
      <i class="bx bx-lock-alt"></i>
    </avatar>
    <div class="product-box__img">
      <media-element v-if="product.cover" :media="product.cover" :size="350" />
      <i v-else class="product-box__img-icon bx bx-image"></i>

      <div class="product-box__tags">
        <tag v-for="tag in product.tags" :key="tag.id" small :color="`#${tag.color}`">
          {{ tag.name }}
        </tag>
      </div>
    </div>
    <div class="flex">
      <div class="name">
        {{ product.name }}<br />
        <ProductPrice :product="product" tag="small" />
      </div>
    </div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

import { Product } from '@/interfaces/Product'
import { formatCurrency } from '@/utils/currency'

import Avatar from '@/components/layout/Avatar.vue'
import MediaElement from '@/components/MediaElement.vue'
import ProductPrice from './ProductPrice.vue'

export default Vue.extend({
  components: { Avatar, MediaElement, ProductPrice },
  props: {
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Product>,
  },
  computed: {
    objectFit(): string {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
    },
  },
  mounted() {
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName })
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
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
      this.$toast.success('Skopiowano ID')
    },
  },
})
</script>

<style lang="scss">
.product-box {
  all: unset;
  color: #000000;
  text-decoration: none;
  position: relative;
  cursor: pointer;

  &__icon {
    position: absolute !important;
    top: -10px;
    left: -10px;
    z-index: 1;
  }

  &__img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 8px;
    background-color: #ffffff;
    overflow: hidden;
    margin-bottom: 4px;
    box-shadow: $shadow;

    .media-element {
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

  &:hover &__img img {
    transform: scale(1.05);
  }

  &__img-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    color: #cccccc;

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
    font-weight: 500;
    padding: 5px;
    padding-bottom: 2px;
  }

  small {
    color: #777777;
  }

  .price {
    padding: 5px 5px 0 0;
  }
}
</style>
