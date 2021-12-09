<template>
  <div class="cms-table-header">
    <button
      v-for="{ key, label, sortable } in headers"
      :key="key"
      class="cms-table-header__col"
      :class="{ 'cms-table-header__col--sortable': sortable }"
      @click="sortable && handleSort(key)"
    >
      {{ label }}
      <template v-if="sortable">
        <i v-if="!sortingObject[key]" class="bx bx-sort-alt-2"></i>
        <i v-else-if="sortingObject[key] === 'asc'" class="bx bx-up-arrow-alt"></i>
        <i v-else-if="sortingObject[key] === 'desc'" class="bx bx-down-arrow-alt"></i>
      </template>
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
    sortFilters: {
      type: String,
      default: '',
    },
  },
  computed: {
    sortingObject(): Record<string, string> {
      return this.sortFilters.split(',').reduce<Record<string, string>>((acc, keyvalue) => {
        const [key, value] = keyvalue.split(':')
        return { ...acc, [key]: value }
      }, {})
    },
  },
  methods: {
    handleSort(key: string) {
      if (!this.sortingObject[key]) this.makeSort({ ...this.sortingObject, [key]: 'asc' })
      else if (this.sortingObject[key] === 'asc')
        this.makeSort({ ...this.sortingObject, [key]: 'desc' })
      else if (this.sortingObject[key] === 'desc')
        this.makeSort({ ...this.sortingObject, [key]: null })
    },
    makeSort(sortObj: Record<string, string | null>) {
      const stringValue = Object.entries(sortObj)
        .filter(([, value]) => !!value)
        .map(([key, value]) => `${key}:${value}`)
        .join(',')

      this.$emit('sort', stringValue)
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
        background-color: $primary-color-100;
      }
    }
  }
}
</style>
