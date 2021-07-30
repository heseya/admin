<template>
  <div
    @click.stop="toggleChildrenVisibility"
    class="product-set"
    :class="{ 'product-set--hidden': !set.public }"
  >
    <div class="product-set__content">
      <vs-button transparent icon size="mini" dark :disabled="!children.length">
        <i v-if="areChildrenVisible" class="bx bx-minus"></i>
        <i v-else class="bx bx-plus"></i>
      </vs-button>

      <span class="product-set__name"> {{ set.name }} (/{{ set.slug }}) </span>

      <div class="product-set__actions">
        <vs-button @click.stop="create" color="success" icon size="small">
          <i class="bx bx-plus"></i>
        </vs-button>
        <vs-button @click.stop="edit" color="dark" icon size="small">
          <i class="bx bx-edit"></i>
        </vs-button>
      </div>
    </div>

    <div class="product-set__children" v-show="areChildrenVisible">
      <product-set
        v-for="child in children"
        :set="{ ...child, parent: set }"
        :key="child.id"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { ProductSet } from '@/interfaces/ProductSet'

export default Vue.extend({
  name: 'ProductSet',
  props: {
    set: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductSet>,
  },
  data: () => ({
    areChildrenVisible: false,
  }),
  computed: {
    children(): ProductSet[] {
      return this.set.children || []
    },
  },
  methods: {
    edit() {
      this.$emit('edit', this.set)
    },
    create() {
      this.$emit('create', this.set)
    },
    toggleChildrenVisibility() {
      if (this.set.children.length) this.areChildrenVisible = !this.areChildrenVisible
    },
  },
})
</script>

<style lang="scss">
.product-set {
  cursor: default;
  border-radius: 0;
  padding: 2px 8px;
  padding-right: 0;
  border-bottom: solid 1px #ccc;

  &:hover {
    background-color: $grey-light;
  }

  &:last-of-type {
    border-bottom: none;
  }

  &__content {
    display: flex;
    align-items: center;
  }

  &__name {
    font-family: $font-sec;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    align-items: flex-start;
    margin-left: 24px;
    margin-left: auto;
  }

  .list-item__action {
    align-self: flex-start;
  }
  .list-item__content {
    width: 100% !important;
  }

  &__children {
    padding-left: 12px;
  }
}
</style>
