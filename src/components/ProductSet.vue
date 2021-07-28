<template>
  <list-item @click="() => {}" :hidden="!set.public" class="product-set">
    {{ set.name }}
    <small>/{{ set.slug }} | {{ set.children.length }} subkolekcji</small>

    <div class="product-set__children">
      <product-set v-for="child in set.children" :set="child" :key="child.id" v-on="$listeners" />
    </div>

    <template #action>
      <div class="product-set__actions">
        <vs-button @click="create" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
        <vs-button @click="edit" color="dark" icon>
          <i class="bx bx-edit"></i>
        </vs-button>
      </div>
    </template>
  </list-item>
</template>

<script lang="ts">
import Vue from 'vue'
import ListItem from '@/components/layout/ListItem.vue'
import { ProductSet } from '@/interfaces/ProductSet'

export default Vue.extend({
  name: 'ProductSet',
  components: { ListItem },
  props: {
    set: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSet>,
  },
  methods: {
    edit() {
      this.$emit('edit', this.set.id)
    },
    create() {
      this.$emit('create', this.set)
    },
  },
})
</script>

<style lang="scss">
.product-set {
  cursor: default;
  display: flex;

  &__actions {
    display: flex;
    align-items: flex-start;
    transform: scale(0.8);
    margin-left: 24px;
  }

  .list-item__action {
    align-self: flex-start;
  }
  .list-item__content {
    width: 100% !important;
  }

  &__children {
    padding-left: 20px;
    width: 100% !important;

    > .product-set {
      width: 100%;
      padding: 4px 12px;
    }
  }
}
</style>
