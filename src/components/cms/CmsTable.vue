<template>
  <div class="cms-table">
    <cms-table-header class="cms-table__header" :headers="config.headers" />

    <component :is="draggable ? 'Draggable' : 'div'" v-model="items">
      <template v-if="shouldRenderList">
        <template v-for="item in items">
          <slot :item="item">
            <cms-table-row :item="item" :headers="config.headers" />
          </slot>
        </template>
      </template>

      <slot v-else></slot>
    </component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import { BaseItem } from '@/store/generator'
import CmsTableHeader from './CmsTableHeader.vue'
import CmsTableRow from './CmsTableRow.vue'
import { TableConfig } from '@/interfaces/CmsTable'

export default Vue.extend({
  components: { CmsTableHeader, Draggable, CmsTableRow },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<BaseItem[]>,
    config: {
      type: Object,
      required: true,
    } as Vue.PropOptions<TableConfig>,
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    items: {
      get(): BaseItem[] {
        return this.value
      },
      async set(items: BaseItem[]) {
        this.$emit('input', items)
      },
    },
    shouldRenderList(): boolean {
      return this.$slots?.default?.length === 1
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
      display: none;
    }
  }
}
</style>
