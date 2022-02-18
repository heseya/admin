<template>
  <div class="per-page-select">
    <label for="per-page" class="per-page-select__label">{{ $t('itemsPerPage') }}</label>
    <div class="per-page-select__select">
      <select id="per-page" v-model="perPage">
        <option v-for="option in perPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<i18n>
{
  "pl": {
    "itemsPerPage": "Elementów na stronę"
  },
  "en": {
    "itemsPerPage": "Items per page"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    perPageOptions(): number[] {
      return [12, 24, 36, 48, 64, 128, 250, 500]
    },
    perPage: {
      get(): number {
        return this.value
      },
      set(v: number) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

<style lang="scss">
.per-page-select {
  display: flex;
  justify-content: center;
  align-items: center;

  &__label {
    font-size: 0.9em;
    margin-right: 8px;
  }

  &__select {
    position: relative;

    select {
      color: $font-color;
      box-shadow: $shadow;
      padding: 8px 6px;
      border: none;
      padding-right: 16px;
      appearance: none;
      border-radius: 4px;
    }

    &::after {
      content: '\ea27';
      font-family: boxicons !important;
      font-weight: 400;
      color: #d9dbe0;
      position: absolute;
      right: 10px;
      top: 50%;
      line-height: 0.8em;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      pointer-events: none;
    }
  }
}
</style>
