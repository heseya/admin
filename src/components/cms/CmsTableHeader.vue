<template>
  <div class="cms-table-header">
    <button
      v-for="header in headers"
      :key="header.key"
      class="cms-table-header__col"
      :class="{ 'cms-table-header__col--sortable': header.sortable }"
      @click="header.sortable && handleSort(getSortKey(header))"
    >
      {{ header.label }}
      <info-tooltip v-if="header.labelTooltip" :text="header.labelTooltip" />
      <template v-if="header.sortable">
        <i v-if="!sortingObject[getSortKey(header)]" class="bx bx-sort-alt-2"></i>
        <i v-else-if="sortingObject[getSortKey(header)] === 'asc'" class="bx bx-up-arrow-alt"></i>
        <i
          v-else-if="sortingObject[getSortKey(header)] === 'desc'"
          class="bx bx-down-arrow-alt"
        ></i>
      </template>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { TableHeader } from '@/interfaces/CmsTable'
import InfoTooltip from '../layout/InfoTooltip.vue'

export default defineComponent({
  components: { InfoTooltip },
  props: {
    headers: {
      type: Array as PropType<TableHeader[]>,
      required: true,
    },
    sortFilters: {
      type: String,
      default: '',
    },
  },
  computed: {
    sortingObject(): Record<string, string> {
      return this.sortFilters.split(',').reduce<Record<string, string>>((acc, keyValue) => {
        const parts = keyValue.split(':')

        const value = parts.pop()!
        return { ...acc, [parts.join(':')]: value }
      }, {})
    },
  },
  methods: {
    getSortKey(header: TableHeader) {
      return typeof header.sortKey === 'function' ? header.sortKey() : header.sortKey || header.key
    },

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
  border-bottom: 2px solid var(--background-color-700);

  &__col {
    all: unset;
    padding: 12px 16px;
    text-transform: uppercase;
    color: var(--gray-color-600);
    font-size: 0.8em;
    transition: 0.3s;

    &--sortable {
      cursor: pointer;

      &:hover {
        background-color: var(--primary-color-100);
      }
    }
  }
}
</style>
