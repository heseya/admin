<template>
  <div class="price-ranges-form">
    <h5 class="price-ranges-form__title">Zakresy cen</h5>
    <div class="price-ranges-form__list">
      <div class="price-ranges-form__row" v-for="(range, i) in priceRanges" :key="`${i}`">
        <vs-input
          label="Minimalna wartość koszyka"
          type="number"
          v-model="range.start"
          :disabled="i === 0"
        />
        <vs-input label="Stawka" type="number" v-model="range.value" />
        <vs-button danger icon @click.stop="removeRange(i)" v-if="i !== 0">
          <i class="bx bxs-trash"></i>
        </vs-button>
      </div>
    </div>
    <vs-button color="#000" size="small" @click="addRange">
      <i class="bx bx-plus"></i> &nbsp;&nbsp; Dodaj zakres
    </vs-button>
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
  },
  computed: {
    priceRanges: {
      get(): ShippingMethodPriceRangeDTO[] {
        return [...this.value].sort((a, b) => a.start - b.start)
      },
      set(v: ShippingMethodPriceRangeDTO[]) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    addRange(start?: number) {
      const rangeStart = start ?? Math.max(...this.priceRanges.map((p) => p.start), 0)
      this.priceRanges = [...this.priceRanges, { start: rangeStart, value: 0 }]
    },
    removeRange(index: number) {
      this.priceRanges = this.priceRanges.filter((_u, i) => i !== index)
    },
  },
  created() {
    if (!this.priceRanges.some((v) => v.start === 0)) this.addRange(0)
  },
})
</script>

<style lang="scss" scoped>
.price-ranges-form {
  &__title {
    margin-bottom: 32px;
  }

  &__list {
    margin-bottom: -20px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr 32px;
    align-items: start;
    grid-gap: 12px;

    .vs-button {
      margin: 0;
      transform: scale(0.7);
    }
  }
}
</style>
