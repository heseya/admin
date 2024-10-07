<template>
  <div class="product-price-form">
    <div class="product-price-form__row">
      <span class="product-price-form__label">{{ $t('basePrice') }}</span>
      <app-input
        v-model="base_price"
        type="number"
        class="product-price-form__input"
        :disabled="isLoading"
        :min="0"
      />
    </div>

    <div v-for="schema in schemas" :key="schema.schema_id" class="product-price-form__row">
      <span class="product-price-form__label">{{ schema.schema_name }}</span>
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
          :min="0"
        />
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "basePrice": "Cena bazowa",
    "updateSuccess": "Cena została zaktualizowana",
    "updateError": "Nie udało się zaktualizować ceny"
  },
  "en": {
    "basePrice": "Base price",
    "updateSuccess": "Price has been updated",
    "updateError": "Failed to update price"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import groupBy from 'lodash/groupBy'
import debounce from 'lodash/debounce'
import { PriceMapPrice, PriceMapProductSchemaPrice } from '@heseya/store-core'

import { formatApiNotificationError } from '@/utils/errors'

import { sdk } from '@/api'

export default defineComponent({
  props: {
    productPrice: {
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
      // TODO: check it! Type can be wrong!
      base_price: this.productPrice.product_price,
      schema_options: {} as Record<string, string>,
    }
  },

  computed: {
    schemas(): { schema_id: string; schema_name: string; options: PriceMapProductSchemaPrice[] }[] {
      return Object.values(groupBy(this.productPrice.schema_options, 'schema_id')).map((items) => ({
        schema_id: items[0].schema_id,
        schema_name: items[0].schema_name,
        options: items,
      }))
    },
  },

  watch: {
    product: {
      handler() {
        this.base_price = this.productPrice.product_price
        this.schema_options = this.productPrice.schema_options.reduce(
          // TODO: check it! Type can be wrong
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
              id: this.productPrice.product_id,
              value: this.base_price.toString(),
            },
          ],
          schema_options: Object.entries(this.schema_options).map(([id, value]) => ({
            id,
            value: value.toString(),
          })),
        })
        this.$emit('update', updatedPrice)
        this.$toast.success(this.$t('updateSuccess').toString())
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e)
        this.$toast.error(`${this.$t('updateError')}: ${formatApiNotificationError(e)}`)
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
    flex-wrap: wrap;
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
