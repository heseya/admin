<template>
  <card class="cms-filters" :class="{ 'cms-filters--expanded': isExpanded }">
    <div class="cms-filters__wrapper">
      <cms-filters-header
        class="cms-filters__header"
        :filters-count="filtersCount"
        @clear-filters="$emit('clear-filters')"
      />
      <div class="cms-filters__content">
        <slot></slot>
      </div>

      <div
        class="cms-filters__mobile-wrapper"
        :class="{ 'cms-filters__mobile-wrapper--open': isModalOpen }"
      >
        <button class="cms-filters__close-btn" @click="isModalOpen = false">
          <img src="@/assets/images/icons/close-icon.svg" alt="Close" />
        </button>
        <cms-filters-header :filters-count="filtersCount" @clear-filters="$emit('clear-filters')" />
        <div class="cms-filters__mobile-content">
          <slot></slot>
        </div>
      </div>
    </div>
    <button v-if="isExpandable" class="cms-filters__more-btn" @click="isExpanded = !isExpanded">
      <i v-if="!isExpanded" class="bx bx-chevrons-down"></i>
      <i v-else class="bx bx-chevrons-up"></i>
    </button>
    <button class="cms-filters__mobile-btn" @click="isModalOpen = true">
      <i class="bx bxs-filter-alt"></i>
    </button>
  </card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '../layout/Card.vue'
import CmsFiltersHeader from './CmsFiltersHeader.vue'

export default Vue.extend({
  components: { Card, CmsFiltersHeader },
  props: {
    filtersCount: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    isExpanded: false,
    isModalOpen: false,
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
  z-index: $desktop-filters-z-index;

  &__wrapper {
    width: 100%;
    padding: 8px;

    @media ($viewport-4) {
      padding: 14px;
    }
  }

  &__content {
    position: static;
    padding-top: 8px;
    max-height: 64px;
    overflow: hidden;
    transition: 0.3s;

    @media ($max-viewport-10) {
      display: none;
    }

    & > ::v-deep *:first-child {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-gap: 10px;
    }

    & ::v-deep {
      .span-2 {
        grid-column: span 2;
      }
      .span-3 {
        grid-column: span 3;
      }
      .span-4 {
        grid-column: span 4;
      }
    }
  }

  &__mobile-wrapper {
    position: fixed;
    left: 0;
    top: 102vh;
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 80px 32px 16px;
    z-index: $mobile-filters-z-index;
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;

    &--open {
      top: 0;
      opacity: 1;
      visibility: visible;
    }

    @media ($viewport-10) {
      display: none !important;
    }

    ::v-deep .app-input {
      margin-bottom: 16px;
    }
  }

  &__mobile-content {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
  }

  &__more-btn,
  &__mobile-btn,
  &__close-btn {
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

  &__more-btn {
    display: none;
    @media ($viewport-10) {
      display: block;
    }
  }

  &__mobile-btn {
    @media ($viewport-10) {
      display: none;
    }
  }

  &__close-btn {
    position: absolute;
    top: 30px;
    right: 32px;
    width: 37px;
    height: 37px;
    padding: 0;
    border-radius: 50%;
    color: #979ea0;
    background-color: $background-color-700;
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
