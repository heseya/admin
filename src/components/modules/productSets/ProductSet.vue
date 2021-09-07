<template>
  <div class="product-set" @click.stop="toggleChildrenVisibility">
    <div class="product-set__content">
      <icon-button type="transparent" size="small" :disabled="!children.length">
        <template #icon>
          <i v-if="areChildrenVisible" class="bx bx-minus"></i>
          <i v-else class="bx bx-plus"></i>
        </template>
      </icon-button>

      <span class="product-set__name">
        <i v-if="!set.public" class="product-set__hidden-icon bx bx-low-vision"></i>
        {{ set.name }} <small>(/{{ set.slug }})</small>
      </span>

      <div class="product-set__actions">
        <a-dropdown
          v-can.any="[$p.ProductSets.ShowDetails, $p.ProductSets.Add]"
          :trigger="['click']"
        >
          <icon-button type="transparent" size="small" @click.stop>
            <i slot="icon" class="bx bx-menu"></i>
          </icon-button>

          <a-menu slot="overlay">
            <a-menu-item v-can="$p.ProductSets.Add" @click="create">
              <i class="bx bx-plus"></i> &nbsp; Dodaj subkolekcje
            </a-menu-item>
            <a-menu-item v-can="$p.ProductSets.ShowDetails" @click="showProducts">
              <i class="bx bx-customize"></i> &nbsp; Zobacz produkty w kolekcji
            </a-menu-item>
            <a-menu-item v-can="$p.ProductSets.ShowDetails" @click="edit">
              <i class="bx bx-edit"></i> &nbsp; Edytuj kolekcję
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <div v-show="areChildrenVisible" class="product-set__children">
      <Draggable v-model="children">
        <product-set
          v-for="child in children"
          :key="child.id"
          :set="{ ...child, parent: set }"
          v-on="$listeners"
        />
      </Draggable>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import { ProductSet } from '@/interfaces/ProductSet'

export default Vue.extend({
  name: 'ProductSet',
  components: { Draggable },
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
    children: {
      get(): ProductSet[] {
        return this.set.children || []
      },
      async set(items: ProductSet[]) {
        this.$accessor.startLoading()
        // @ts-ignore // TODO: fix extended store actions typings
        await this.$accessor.productSets.reorderChildren({
          parentId: this.set.id,
          ids: items.map((i) => i.id),
        })
        this.$accessor.stopLoading()
      },
    },
  },
  methods: {
    edit() {
      this.$emit('edit', this.set)
    },
    showProducts() {
      this.$emit('showProducts', this.set)
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
  border-bottom: solid 1px $background-color-700;
  cursor: grab;
  transition: 0.3s;

  &.sortable-chosen,
  &:hover {
    background-color: $background-color-500;
  }

  &__hidden-icon {
    font-size: 0.7em;
  }

  &:last-of-type {
    border-bottom: none;
  }

  &__content {
    display: flex;
    align-items: center;
  }

  &__name {
    font-weight: 600;

    small {
      font-weight: 400;
    }
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
