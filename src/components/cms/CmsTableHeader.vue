<template>
  <div class="cms-table-header">
    <button
      v-for="{ key, label, sortable, labelTooltip } in headers"
      :key="key"
      class="cms-table-header__col"
      :class="{ 'cms-table-header__col--sortable': sortable }"
      @click="sortable && handleSort(key)"
    >
      {{ label }}
      <info-tooltip v-if="labelTooltip" :text="labelTooltip" />
      <template v-if="sortable">
        <i v-if="!sortingObject[key]" class="bx bx-sort-alt-2"></i>
        <i v-else-if="sortingObject[key] === 'asc'" class="bx bx-up-arrow-alt"></i>
        <i v-else-if="sortingObject[key] === 'desc'" class="bx bx-down-arrow-alt"></i>
      </template>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'

import { TableHeader } from '@/interfaces/CmsTable'
import InfoTooltip from '../layout/InfoTooltip.vue'

export default defineComponent({
  components: { InfoTooltip },
  props: {
    headers: {
      type: Array,
      required: true,
    } as PropOptions<TableHeader[]>,
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
