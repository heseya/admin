<template>
  <div class="cms-filters-header">
    <div class="cms-filters-header__title">
      Filtry
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
        <img src="@/assets/images/icons/close-icon.svg" alt="Close" />
      </template>
      Wyczyść ustawione filtry
    </icon-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconButton from '@/components/layout/IconButton.vue'

export default Vue.extend({
  components: { IconButton },
  props: {
    filtersCount: {
      type: Number,
      default: 0,
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
    background-color: $green-color-500;
    color: #fff;
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

      ::v-deep .icon-button__icon {
        display: none;
      }
    }

    @media ($max-viewport-3) {
      font-size: 0.7em;
    }
  }
}
</style>
