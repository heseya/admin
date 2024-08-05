<template>
  <div class="product-price-form">
    <div class="product-price-form__row">
      <span class="product-price-form__label">{{ 'Cena bazowa' }}</span>
      <app-input
        v-model="base_price"
        type="number"
        class="product-price-form__input"
        :disabled="isLoading"
      />
    </div>

    <div v-for="schema in schemas" :key="schema.schema_id" class="product-price-form__row">
      <span class="product-price-form__label">{{ 'Schemat 1' }}</span>
      <div
        v-for="option in schema.options"
        :key="option.schema_option_id"
        class="product-price-form__row"
      >
        <span class="product-price-form__label product-price-form__label--black">
          {{ option.schema_option_name }}
        </span>
        <app-input
          v-model="schema_options[option.schema_option_id]"
          type="number"
          class="product-price-form__input"
          :disabled="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "updateSuccess": "Cena została zaktualizowana",
    "updateError": "Nie udało się zaktualizować ceny"
  },
  "en": {
    "updateSuccess": "Price has been updated",
    "updateError": "Failed to update price"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import groupBy from 'lodash/groupBy'
import debounce from 'lodash/debounce'
import { PriceMapPrice } from '@heseya/store-core'

import { sdk } from '@/api'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<PriceMapPrice>,
      required: true,
    },
    priceMapId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      base_price: this.product.product_price,
      schema_options: {} as Record<string, string>,
    }
  },

  computed: {
    schemas(): any {
      return Object.values(groupBy(this.product.schema_options, 'schema_id')).map((items) => ({
        schema_id: items[0].schema_id,
        schema_name: items[0].schema_name,
        options: items,
      }))
    },
  },

  watch: {
    product: {
      handler() {
        this.base_price = this.product.product_price
        this.schema_options = this.product.schema_options.reduce(
          (acc, option) => ({ ...acc, [option.schema_option_id]: option.schema_option_price }),
          {},
        )
      },
      immediate: true,
    },

    base_price: {
      handler() {
        this.debouncedSavePrice()
      },
    },
    schema_options: {
      handler() {
        this.debouncedSavePrice()
      },
      deep: true,
    },
  },

  methods: {
    async savePrice() {
      this.isLoading = true
      try {
        const [updatedPrice] = await sdk.PriceMaps.updatePrices(this.priceMapId, {
          products: [
            {
              id: this.product.product_id,
              value: this.base_price,
            },
          ],
          schema_options: Object.entries(this.schema_options).map(([id, value]) => ({
            id,
            value,
          })),
        })
        this.$emit('update', updatedPrice)
        this.$toast.error(this.$t('updateSuccess').toString())
      } catch (e) {
        this.$toast.error(this.$t('updateError').toString())
      }
      this.isLoading = false
    },

    debouncedSavePrice: debounce(function (this: any) {
      this.$nextTick(() => {
        this.savePrice()
      })
    }, 1000),
  },
})
</script>

<style lang="scss">
.product-price-form {
  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__input {
    width: 150px;
  }

  &__label {
    color: $gray-color-600;
    font-size: 0.9em;
    flex-shrink: 0;

    &--black {
      color: $gray-color-900;
    }
  }
}
</style>
