<template>
  <cms-table-row
    class="product-list-item"
    :item="product"
    :headers="table.headers"
    @click="onClick"
  >
    <template #cover>
      <avatar color="#eee">
        <img
          v-if="product.cover"
          :src="`${product.cover.url}?w=100&h=100`"
          :style="{ objectFit }"
        />
        <i v-else class="product-list-item__img-icon bx bx-image"></i>
      </avatar>
    </template>

    <template #name>
      <b>{{ product.name }}</b>
    </template>

    <span slot="price">{{ formatCurrency(product.price) }}</span>

    <template #tags>
      <div class="product-list-item__tags">
        <div
          v-for="tag in product.tags"
          :key="tag.id"
          class="product-list-item__tag"
          :style="{ backgroundColor: `#${tag.color}` }"
        >
          {{ tag.name }}
        </div>
        <span v-if="product.tags.length === 0">-</span>
      </div>
    </template>

    <template #visible>
      <div v-if="product.visible" class="product-list-item__tag product-list-item__tag--success">
        <i class="bx bx-check"></i> Tak
      </div>
      <div v-else class="product-list-item__tag product-list-item__tag--error">
        <i class="bx bx-x"></i> Nie
      </div>
    </template>
  </cms-table-row>
</template>

<script lang="ts">
import Vue from 'vue'

import Avatar from '@/components/layout/Avatar.vue'

import { Product } from '@/interfaces/Product'
import { formatCurrency } from '@/utils/currency'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import { TableConfig } from '@/interfaces/CmsTable'

export default Vue.extend({
  components: { Avatar, CmsTableRow },
  props: {
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Product>,
    table: {
      type: Object,
      required: true,
    } as Vue.PropOptions<TableConfig<Product>>,
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
.product-list-item {
  position: relative;

  .cms-table-row__col:first-of-type {
    padding-top: 6px;
    padding-bottom: 6px;
  }

  &__icon {
    position: absolute;
    top: 8px;
    left: 8px;

    i {
      font-size: 0.9em;
    }
  }

  &__img-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    color: #999999;

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

  &__tags {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  &__tag {
    display: inline-block;
    margin-right: 3px;
    margin-top: 3px;
    background-color: #000000;
    padding: 3px 6px;
    color: #ffffff;
    font-size: 0.9em;
    border-radius: 3px;

    &--success {
      background-color: $green-color-500;
    }

    &--error {
      background-color: $red-color-500;
    }
  }
}
</style>
