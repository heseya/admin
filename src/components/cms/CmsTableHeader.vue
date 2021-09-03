<template>
  <div class="cms-table-header">
    <button
      v-for="{ key, label, sortable } in headers"
      :key="key"
      class="cms-table-header__col"
      :class="{ 'cms-table-header__col--sortable': sortable }"
      @click="sort(key)"
    >
      {{ label }}
      <i v-if="sortable" class="bx bx-down-arrow-alt"></i>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { TableHeader } from '@/interfaces/CmsTable'

export default Vue.extend({
  props: {
    headers: {
      type: Array,
      required: true,
    } as Vue.PropOptions<TableHeader[]>,
  },
  methods: {
    sort(key: string) {
      // TODO: implement sorting
      // eslint-disable-next-line no-console
      console.log('sort by:', key)
    },
  },
})
</script>

<style lang="scss" scoped>
.cms-table-header {
  all: unset;
  display: grid;
  padding: 0 16px;
  grid-template-columns: var(--table-cols);
  border-bottom: 2px solid $background-color-700;

  &__col {
    all: unset;
    padding: 12px 16px;
    text-transform: uppercase;
    color: $gray-color-600;
    font-size: 0.8em;
    transition: 0.3s;

    &--sortable {
      cursor: pointer;

      &:hover {
        background-color: #f3f9ff;
      }
    }
  }
}
</style>
