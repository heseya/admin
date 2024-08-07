<template>
  <card class="cms-filters" :class="{ 'cms-filters--expanded': isExpanded }">
    <div class="cms-filters__wrapper">
      <cms-filters-header
        class="cms-filters__header"
        :filters="filters"
        @clear-filters="$emit('clear-filters')"
      />
      <div ref="filters" class="cms-filters__content">
        <slot v-if="!isMobileView"></slot>
      </div>

      <div
        class="cms-filters__mobile-wrapper"
        :class="{ 'cms-filters__mobile-wrapper--open': isModalOpen }"
      >
        <button class="cms-filters__close-btn" @click="isModalOpen = false">
          <img src="/img/icons/close-icon.svg" :alt="$t('common.close').toString()" />
        </button>
        <cms-filters-header :filters="filters" @clear-filters="$emit('clear-filters')" />
        <div class="cms-filters__mobile-content">
          <slot v-if="isMobileView"></slot>
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
import { defineComponent, PropType } from 'vue'

import Card from '@/components/layout/Card.vue'
import CmsFiltersHeader from '@/components/cms/CmsFiltersHeader.vue'

export default defineComponent({
  components: { Card, CmsFiltersHeader },
  props: {
    filters: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  data: () => ({
    isExpanded: false,
    isModalOpen: false,
    isExpandable: false,
    isMobileView: false,
  }),
  watch: {
    isExpandable() {
      if (!this.isExpandable && this.isExpanded) this.isExpanded = false
    },
    isExpanded() {
      const content = this.$refs.filters as HTMLElement
      if (this.isExpanded) {
        // This reduces flash of the scrollbar when expanded
        setTimeout(() => {
          content.style.overflowY = 'auto'
        }, 300)
      } else {
        content.style.overflowY = 'hidden'
        content.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    },
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      // @ts-ignore
      if (this.$refs.filters.scrollHeight > this.$refs.filters.offsetHeight + 5)
        this.isExpandable = true
      else this.isExpandable = false

      if (window.innerWidth < 1024) this.isMobileView = true
      else this.isMobileView = false
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
    max-height: 68px;
    overflow: hidden;
    transition: 0.3s linear;
    display: none;

    @media ($viewport-10) {
      display: block;
    }

    & > :deep(*:first-child) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-gap: 4px 10px;
      grid-auto-flow: dense;
    }

    :deep(.span-2) {
      grid-column: span 2;
    }

    :deep(.span-3) {
      grid-column: span 3;
    }
    :deep(.span-4) {
      grid-column: span 4;
    }
  }

  &__mobile-wrapper {
    position: fixed;
    left: 0;
    top: 102vh;
    width: 100%;
    height: 100%;
    background-color: var(--white-color);
    padding: 80px 32px 80px;
    z-index: $mobile-filters-z-index;
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;
    overflow: auto;

    &--open {
      top: 0;
      opacity: 1;
      visibility: visible;
    }

    @media ($viewport-10) {
      display: none !important;
    }

    :deep(.app-input) {
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
    border-left: 1px solid var(--background-color-600);
    padding: 4px;
    transition: 0.3s;
    font-size: 1.4em;

    &:hover {
      background-color: var(--background-color-600);
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
    color: var(--gray-color-500);
    background-color: var(--background-color-700);
  }

  &--expanded &__content {
    max-height: 60px * 6;
  }
}
</style>
