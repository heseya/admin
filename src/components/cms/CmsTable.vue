<template>
  <div
    class="cms-table"
    :class="{ 'cms-table--draggable': draggable }"
    :style="{ '--table-cols': gridColumns }"
  >
    <cms-table-header
      class="cms-table__header"
      :headers="config.headers"
      :sort-filters="sortFilters"
      @sort="(v) => $emit('sort', v)"
    />

    <component
      :is="draggable ? 'Draggable' : 'div'"
      v-model="items"
      class="cms-table__content"
      handle=".reorder-handle"
      @change="handleReorder"
    >
      <template v-if="shouldRenderList">
        <div v-for="item in items" :key="item.id" class="cms-table__item">
          <slot name="item" :item="item">
            <cms-table-row
              :item="item"
              :headers="config.headers"
              :to="config.rowUrlBuilder ? config.rowUrlBuilder(item) : undefined"
              :no-hover="noHover"
              :draggable="draggable"
              :el="rowEl"
              @click="config.rowOnClick || (() => {})"
            />
          </slot>
        </div>
      </template>

      <slot v-else></slot>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Draggable from 'vuedraggable'

import { VuexBaseItem } from '@/interfaces/VuexGenerator'
import { TableConfig } from '@/interfaces/CmsTable'

import CmsTableHeader from '@/components/cms/CmsTableHeader.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

export default defineComponent({
  components: { CmsTableHeader, Draggable, CmsTableRow },

  provide() {
    const parent = this
    return {
      handleDragTop(item: VuexBaseItem) {
        parent.handleReorder({
          moved: { element: item, newIndex: 0, oldIndex: parent.items.indexOf(item) },
        })
        const itemsWithout = parent.items.filter((i) => i.id !== item.id)
        parent.items = [item, ...itemsWithout]
      },

      handleDragBottom(item: VuexBaseItem) {
        parent.handleReorder({
          moved: {
            element: item,
            newIndex: parent.items.length - 1,
            oldIndex: parent.items.indexOf(item),
          },
        })
        const itemsWithout = parent.items.filter((i) => i.id !== item.id)
        parent.items = [...itemsWithout, item]
      },
    }
  },

  props: {
    value: {
      type: Array as PropType<VuexBaseItem[]>,
      required: true,
    },
    config: {
      type: Object as PropType<TableConfig>,
      required: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    noHover: {
      type: Boolean,
      default: false,
    },
    rowEl: {
      type: String,
      default: undefined,
    },
    sortFilters: {
      type: String,
      default: '',
    },
  },
  computed: {
    items: {
      get(): VuexBaseItem[] {
        return this.value
      },
      async set(items: VuexBaseItem[]) {
        this.$emit('input', items)
      },
    },
    shouldRenderList(): boolean {
      return !this.$slots.default
    },
    gridColumns(): string {
      return this.config.headers.map((header) => header.width || '1fr').join(' ')
    },
  },
  methods: {
    click() {
      this.$emit('click')
    },
    handleReorder({
      moved,
    }: {
      moved: { element: VuexBaseItem; newIndex: number; oldIndex: number }
    }) {
      this.$emit('reorder', moved)
    },
  },
})
</script>

<style lang="scss">
.cms-table {
  &__header {
    @media ($max-viewport-11) {
      display: none !important;
    }
  }

  &__item {
    width: 100%;

    > * {
      display: block;
      width: 100% !important;
    }
  }

  &--draggable {
    @media ($viewport-11) {
      .cms-table-header {
        padding-left: 30px;
      }
    }
  }
}
</style>
