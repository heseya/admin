<template>
  <div class="price-ranges-form">
    <h5 class="price-ranges-form__title">{{ $t('title') }} {{ currency.name }}</h5>

    <div class="price-ranges-form__list">
      <div v-for="(range, i) in priceRanges" :key="`${i}`" class="price-ranges-form__row">
        <app-input
          v-model="range.start"
          :label="$t('rangeStart')"
          type="number"
          :disabled="i === 0 || disabled"
        />
        <app-input
          v-model="range.value"
          :disabled="disabled"
          :label="$t('rangeValue')"
          type="number"
        />
        <icon-button
          class="price-ranges-form__button"
          :disabled="disabled || i === 0"
          type="transparent"
          @click.stop="removeRange(i)"
        >
          <template #icon>
            <i class="bx bxs-trash"></i>
          </template>
        </icon-button>
      </div>
    </div>
    <small class="price-ranges-form__error">{{ error }}</small>
    <icon-button
      class="price-ranges-form__btn"
      :disabled="disabled"
      size="small"
      @click="addRange()"
    >
      <template #icon>
        <i class="bx bx-plus"></i>
      </template>
      {{ $t('addRange') }}
    </icon-button>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Zakresy cen dla waluty:",
    "addRange": "Dodaj zakres",
    "rangeStart": "Minimalna wartość koszyka",
    "rangeValue": "Stawka"
  },
  "en": {
    "title": "Price ranges for currency:",
    "addRange": "Add range",
    "rangeStart": "Minimal cart value",
    "rangeValue": "Rate"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ShippingMethodPriceRangeDto, Currency } from '@heseya/store-core'

export default defineComponent({
  props: {
    currency: {
      type: Object as PropType<Currency>,
      required: true,
    },
    value: {
      type: Array as PropType<ShippingMethodPriceRangeDto[]>,
      default: () => [],
    },
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
      get(): ShippingMethodPriceRangeDto[] {
        return this.value.filter(({ currency }) => currency === this.currency.code)
      },
      set(v: ShippingMethodPriceRangeDto[]) {
        this.$emit('input', [
          ...v,
          ...this.value.filter(({ currency }) => currency !== this.currency.code),
        ])
      },
    },
  },
  created() {
    if (!this.priceRanges.some((v) => parseFloat(v.start) === 0)) this.addRange(0)
  },
  methods: {
    addRange(start?: number) {
      const rangeStart = (
        start ?? Math.max(...this.priceRanges.map((p) => parseFloat(p.start)), 0)
      ).toString()

      this.priceRanges = [
        ...this.priceRanges,
        { start: rangeStart, value: '0', currency: this.currency.code },
      ].sort((a, b) => parseFloat(a.start) - parseFloat(b.start))
    },
    removeRange(index: number) {
      this.priceRanges = this.priceRanges
        .filter((_u, i) => i !== index)
        .sort((a, b) => parseFloat(a.start) - parseFloat(b.start))
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
    align-items: end;
    grid-gap: 12px;
  }

  &__button {
    align-self: center;
  }

  &__error {
    display: block;
    color: red;
    margin-left: 6px;
    font-size: 0.7em;
    margin-bottom: 6px;
    margin-top: 20px;
  }
}
</style>
