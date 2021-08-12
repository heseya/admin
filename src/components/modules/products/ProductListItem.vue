<template>
  <list-item @click="onClick" class="product-list-item">
    <template #avatar>
      <vs-avatar color="#eee">
        <img
          v-if="product.cover"
          :src="`${product.cover.url}?w=100&h=100`"
          :style="{ objectFit }"
        />
        <i v-else class="product-list-item__img-icon bx bx-image"></i>
      </vs-avatar>
    </template>

    {{ product.name }}
    <small>{{ product.price }} {{ currency }}</small>

    <template #action>
      <div class="product-list-item__tags">
        <div
          class="product-list-item__tag"
          :style="{ backgroundColor: `#${tag.color}` }"
          v-for="tag in product.tags"
          :key="tag.id"
        >
          {{ tag.name }}
        </div>
      </div>

      <vs-avatar size="22" class="product-list-item__icon" color="#000" v-if="!product.visible">
        <i class="bx bx-lock-alt"></i>
      </vs-avatar>
    </template>
  </list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import ListItem from '../../layout/ListItem.vue'

export default Vue.extend({
  components: { ListItem },
  props: {
    product: Object,
  },
  computed: {
    currency(): string {
      return this.$accessor.currency
    },
    objectFit(): string {
      return +this.$accessor.env.dashboard_products_contain ? 'contain' : 'cover'
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
.product-list-item {
  position: relative;

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
    color: #999;

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
}
</style>
