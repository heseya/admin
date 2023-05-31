<template>
  <router-link class="product-box" :to="`/products/${product.id}`">
    <tag
      v-if="!product.visible"
      small
      class="product-box__icon product-box__icon--visible"
      type="error"
    >
      <i class="bx bx-low-vision"></i> {{ $t('common.hidden') }}
    </tag>
    <tag
      v-if="product.shipping_digital"
      small
      class="product-box__icon product-box__icon--shipping-digital"
      type="primary"
    >
      <i class="bx bx-signal-5"></i> {{ $t('shippingDigital') }}
    </tag>
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
      <div class="product-box__name">
        {{ product.name }}<br />
        <ProductPrice :product="product" tag="small" />
      </div>
    </div>
  </router-link>
</template>

<i18n lang="json">
{
  "pl": {
    "shippingDigital": "Dostawa cyfrowa"
  },
  "en": {
    "shippingDigital": "Digital shipping"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import { Product } from '@heseya/store-core'

import { formatCurrency } from '@/utils/currency'

import MediaElement from '@/components/MediaElement.vue'
import ProductPrice from './ProductPrice.vue'

import { FEATURE_FLAGS } from '@/consts/featureFlags'

export default defineComponent({
  components: { MediaElement, ProductPrice },
  props: {
    product: {
      type: Object,
      required: true,
    } as PropOptions<Product>,
  },
  computed: {
    objectFit(): string {
      return +this.$accessor.config.env[FEATURE_FLAGS.ProductContain] ? 'contain' : 'cover'
    },
  },
  mounted() {
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName })
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
    },
  },
})
</script>

<style lang="scss">
.product-box {
  all: unset;
  display: block !important;
  color: var(--font-color);
  text-decoration: none;
  position: relative;
  cursor: pointer;

  &__icon {
    position: absolute !important;
    z-index: 1;

    &--visible {
      top: -10px;
      left: -10px;
    }

    &--shipping-digital {
      top: -10px;
      right: -10px;
    }
  }

  &__img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 8px;
    background-color: var(--white-color);
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

  &:hover &__img .media-element {
    transform: scale(1.05);
  }

  &__img-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    color: var(--gray-color-300);

    &::after {
      content: '';
      display: block;
      width: 120%;
      height: 2px;
      background-color: var(--red-color-500);
      position: absolute;
      top: 50%;
      left: -10%;
      transform: rotate(-45deg);
    }
  }

  &__name {
    font-weight: 500;
    padding: 5px;
    padding-bottom: 2px;
    color: var(--font-color);
  }

  small {
    color: var(--gray-color-600);
  }
}
</style>
