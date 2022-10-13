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
    >
      <template v-if="shouldRenderList">
        <div v-for="item in items" :key="item.id" class="cms-table__item">
          <slot name="item" :item="item">
            <cms-table-row
              :item="item"
              :headers="config.headers"
              :to="config.rowUrlBuilder ? config.rowUrlBuilder(item) : null"
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
import Vue from 'vue'
import Draggable from 'vuedraggable'

import { VuexBaseItem } from '@/interfaces/VuexGenerator'
import { TableConfig } from '@/interfaces/CmsTable'

import CmsTableHeader from '@/components/cms/CmsTableHeader.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

export default Vue.extend({
  components: { CmsTableHeader, Draggable, CmsTableRow },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<VuexBaseItem[]>,
    config: {
      type: Object,
      required: true,
    } as Vue.PropOptions<TableConfig>,
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

      .cms-table-row {
        padding-left: 30px !important;
        position: relative;

        &::before {
          font-family: $boxiconsFont;
          font-weight: 400;
          content: '\eb5f';
          position: absolute;
          left: 0px;
          font-size: 1.1em;
          line-height: 1em;
          padding: 6px 13px;
          cursor: move;
          transform: translateY(50%);
          color: var(--gray-color-500);
        }
      }
    }
  }
}
</style>
