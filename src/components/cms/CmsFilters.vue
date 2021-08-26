<template>
  <card class="cms-filters" :class="{ 'cms-filters--expanded': isExpanded }">
    <div class="cms-filters__wrapper">
      <div class="cms-filters__header">
        <div class="cms-filters__title">
          Filtry
          <div v-if="filtersCount" class="cms-filters__badge">{{ filtersCount }}</div>
        </div>
        <icon-button
          :disabled="filtersCount === 0"
          type="default"
          size="small"
          @click="$emit('clear-filters')"
        >
          <template #icon>
            <img src="@/assets/images/icons/close-icon.svg" alt="Close" />
          </template>
          Wyczyść ustawione filtry
        </icon-button>
      </div>
      <div ref="content" class="cms-filters__content">
        <slot></slot>
      </div>
    </div>
    <button v-if="isExpandable" class="cms-filters__more-btn" @click="isExpanded = !isExpanded">
      <i v-if="!isExpanded" class="bx bx-chevrons-down"></i>
      <i v-else class="bx bx-chevrons-up"></i>
    </button>
  </card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '../layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'

export default Vue.extend({
  components: { IconButton, Card },
  props: {
    filtersCount: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    isExpanded: false,
  }),
  computed: {
    isExpandable(): boolean {
      // TODO: add logic to determine if filters are expandable
      return false
    },
  },
})
</script>

<style lang="scss" scoped>
.cms-filters {
  display: flex;
  padding: 0;
  position: sticky;
  top: 16px;
  z-index: 100;

  &__wrapper {
    width: 100%;
    padding: 14px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 1.1em;
    font-weight: 600;
    display: flex;
    align-items: flex-start;
  }

  &__badge {
    background-color: $green-color-500;
    color: #fff;
    font-size: 0.8rem;
    line-height: 0.7rem;
    font-weight: 300;
    padding: 3px 4px;
    border-radius: 3px;
    margin-left: 4px;
  }

  &__content {
    padding-top: 24px;
    max-height: 64px;
    overflow: hidden;
    transition: 0.3s;

    & > ::v-deep *:first-child {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-gap: 10px;
    }
  }

  &__more-btn {
    all: unset;
    display: block;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid $background-color-600;
    padding: 4px;
    transition: 0.3s;
    font-size: 1.4em;

    &:hover {
      background-color: $background-color-600;
    }
  }

  &--expanded &__content {
    max-height: 64px * 4;
  }

  ::v-deep {
    .vs-select-content {
      width: 100%;
      max-width: 100%;
    }
  }
}
</style>
