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
      :force-fallback="true"
      :scroll-sensitivity="200"
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

    const handleDragTo = (item: VuexBaseItem, newIndex: number) => {
      if (newIndex < 0) newIndex = 0
      if (newIndex >= parent.items.length) newIndex = parent.items.length - 1

      parent.handleReorder({
        moved: { element: item, newIndex, oldIndex: parent.items.indexOf(item) },
      })

      const items = [...parent.items]
      items.splice(items.indexOf(item), 1)
      items.splice(newIndex, 0, item)
      parent.items = items
    }

    return {
      handleDragTo,
      handleDragBy(item: VuexBaseItem, by: number) {
        const newIndex = parent.items.indexOf(item) + by
        handleDragTo(item, newIndex)
      },
    }
  },

  props: {
    value: {
      type: Array as PropType<VuexBaseItem[]>,
      required: true,
    },
    config: {
      type: Object as PropType<TableConfig<any>>,
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
