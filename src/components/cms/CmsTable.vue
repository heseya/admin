<template>
  <div class="cms-table">
    <cms-table-header class="cms-table__header" :labels="labels" />

    <component :is="draggable ? 'Draggable' : 'div'" v-model="items">
      <template v-for="item in items">
        <slot :item="item">
          <cms-table-row :item="item" :labels="labels" />
        </slot>
      </template>
    </component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import { BaseItem } from '@/store/generator'
import CmsTableHeader from './CmsTableHeader.vue'
import CmsTableRow from './CmsTableRow.vue'
import { TableHeader } from '@/interfaces/CmsTable'

export default Vue.extend({
  components: { CmsTableHeader, Draggable, CmsTableRow },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<BaseItem[]>,
    labels: {
      type: Array,
      required: true,
    } as Vue.PropOptions<TableHeader[]>,
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
