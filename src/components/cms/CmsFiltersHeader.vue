<template>
  <div class="cms-filters-header">
    <div class="cms-filters-header__title">
      {{ $t('filtersTitle') }}
      <div v-if="filtersCount" class="cms-filters-header__badge">{{ filtersCount }}</div>
    </div>
    <icon-button
      :disabled="filtersCount === 0"
      type="default"
      size="small"
      class="cms-filters-header__btn"
      @click="$emit('clear-filters')"
    >
      <template #icon>
        <img src="/img/icons/close-icon.svg" :alt="$t('common.close').toString()" />
      </template>
      {{ $t('clearFilters') }}
    </icon-button>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "filtersTitle": "Filtry",
    "clearFilters": "Wyczyść ustawione filtry"
  },
  "en": {
    "filtersTitle": "Filters",
    "clearFilters": "Clear set filters"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { formatFilters } from '@/utils/utils'

export default defineComponent({
  props: {
    filters: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  computed: {
    filtersCount(): number {
      return Object.entries(formatFilters(this.filters)).filter(
        ([key, value]) => key !== 'sort' && !!value,
      ).length
    },
  },
})
</script>

<style lang="scss" scoped>
.cms-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__title {
    font-size: 1.1em;
    font-weight: 600;
    display: flex;
    align-items: flex-start;
  }

  &__badge {
    background-color: var(--green-color-500);
    color: var(--white-color);
    font-size: 0.8rem;
    line-height: 0.7rem;
    font-weight: 300;
    padding: 3px 4px;
    border-radius: 3px;
    margin-left: 4px;
  }

  &__btn {
    @media ($max-viewport-4) {
      font-size: 0.8em;
      padding: 3px 8px;
      margin: 0;

      :deep(.icon-button__icon) {
        display: none;
      }
    }

    @media ($max-viewport-3) {
      font-size: 0.7em;
    }
  }
}
</style>
