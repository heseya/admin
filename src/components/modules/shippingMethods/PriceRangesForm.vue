<template>
  <div class="price-ranges-form">
    <h5 class="price-ranges-form__title">Zakresy cen</h5>
    <div class="price-ranges-form__list">
      <div v-for="(range, i) in priceRanges" :key="`${i}`" class="price-ranges-form__row">
        <app-input
          v-model="range.start"
          label="Minimalna wartość koszyka"
          type="number"
          :disabled="i === 0 || disabled"
        />
        <app-input v-model="range.value" :disabled="disabled" label="Stawka" type="number" />
        <icon-button
          :disabled="disabled || i === 0"
          type="transparent"
          @click.stop="removeRange(i)"
        >
          <template #icon><i class="bx bxs-trash"></i></template>
        </icon-button>
      </div>
    </div>
    <small class="price-ranges-form__error">{{ error }}</small>
    <icon-button class="price-ranges-form__btn" :disabled="disabled" size="small" @click="addRange">
      <template #icon><i class="bx bx-plus"></i></template>
      Dodaj zakres
    </icon-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { ShippingMethodPriceRangeDTO } from '@/interfaces/ShippingMethod'

export default Vue.extend({
  props: {
    value: {
      type: Array,
      default: () => [{ start: 0, value: 0 }],
    } as Vue.PropOptions<ShippingMethodPriceRangeDTO[]>,
    error: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    priceRanges: {
      get(): ShippingMethodPriceRangeDTO[] {
        return this.value
      },
      set(v: ShippingMethodPriceRangeDTO[]) {
        this.$emit('input', v)
      },
    },
  },
  created() {
    if (!this.priceRanges.some((v) => v.start === 0)) this.addRange(0)
  },
  methods: {
    addRange(start?: number) {
      const rangeStart = start ?? Math.max(...this.priceRanges.map((p) => p.start), 0)
      this.priceRanges = [...this.priceRanges, { start: rangeStart, value: 0 }].sort(
        (a, b) => a.start - b.start,
      )
    },
    removeRange(index: number) {
      this.priceRanges = this.priceRanges
        .filter((_u, i) => i !== index)
        .sort((a, b) => a.start - b.start)
    },
  },
})
</script>

<style lang="scss" scoped>
.price-ranges-form {
  &__list {
    margin-bottom: -20px;
  }

  &__btn {
    margin-top: 24px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr 32px;
    align-items: center;
    grid-gap: 12px;

    .vs-button {
      margin: 0;
      transform: scale(0.7);
    }
  }

  &__error {
    display: block;
    color: red;
    margin-left: 6px;
    font-size: 0.7em;
    margin-bottom: 6px;
  }
}
</style>
