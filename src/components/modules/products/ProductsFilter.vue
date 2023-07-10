<template>
  <div class="products-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search').toString()"
      allow-clear
      @input="debouncedSearch"
    />

    <autocomplete-input
      v-model="local.sets"
      prop-mode="slug"
      model-url="product-sets"
      :label="$t('sets').toString()"
      @input="debouncedSearch"
    >
      <template #option="set">
        {{ set.name }}&nbsp;<small>(/{{ set.slug }})</small>
      </template>
    </autocomplete-input>

    <autocomplete-input
      v-model="local.tags"
      prop-mode="id"
      model-url="tags"
      :label="$t('tags').toString()"
      @input="debouncedSearch"
    >
      <template #option="{ name, color }">
        <div class="products-filter-tags__option">
          <div class="products-filter-tags__color" :style="{ backgroundColor: `#${color}` }"></div>
          {{ name }}
        </div>
      </template>
    </autocomplete-input>

    <boolean-select
      v-model="local.available"
      :label="$t('available').toString()"
      @change="debouncedSearch"
    />
    <boolean-select
      v-model="local.public"
      :label="$t('public').toString()"
      @change="debouncedSearch"
    />
    <boolean-select
      v-model="local.has_cover"
      :label="$t('has_cover').toString()"
      @change="debouncedSearch"
    />
    <boolean-select
      v-model="local.has_items"
      :label="$t('has_items').toString()"
      @change="debouncedSearch"
    />
    <boolean-select
      v-model="local.has_schemas"
      :label="$t('has_schemas').toString()"
      @change="debouncedSearch"
    />
    <boolean-select
      v-model="local.shipping_digital"
      :label="$t('shipping_digital').toString()"
      @change="debouncedSearch"
    />

    <range-input
      :value="{ min: local['price.min'], max: local['price.max'] }"
      :label="$t('price').toString()"
      :addon-after="$accessor.config.currency"
      :min="0"
      @input="
        (v) => {
          updateRangeValue('price', v)
          debouncedSearch()
        }
      "
    />

    <attribute-filter-input
      v-for="attr in customFilters"
      :key="attr.id"
      :value="
        attr.type === AttributeType.Date || attr.type === AttributeType.Number
          ? { min: local[`attribute.${attr.slug}.min`], max: local[`attribute.${attr.slug}.max`] }
          : local[`attribute.${attr.slug}`]
      "
      :attribute="attr"
      @input="
        (v) => {
          attr.type === AttributeType.Date || attr.type === AttributeType.Number
            ? updateRangeValue(`attribute.${attr.slug}`, v)
            : (local[`attribute.${attr.slug}`] = v)
          debouncedSearch()
        }
      "
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "sets": "Kolekcja",
    "tags": "Tagi",
    "public": "Widoczność",
    "available": "Dostępne",
    "has_cover": "Posiada okładkę",
    "has_items": "Posiada produkty magazynowe",
    "has_schemas": "Posiada schematy",
    "shipping_digital": "Wysyłka cyfrowa",
    "price": "Cena"
  },
  "en": {
    "sets": "Collection",
    "tags": "Tags",
    "public": "Public",
    "available": "Available",
    "has_cover": "Has cover",
    "has_items": "Has items",
    "has_schemas": "Has schemas",
    "shipping_digital": "Digital shipping",
    "price": "Price"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import { defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import { Attribute, AttributeType } from '@heseya/store-core'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import AttributeFilterInput from './AttributeFilterInput.vue'
import BooleanSelect from '@/components/form/BooleanSelect.vue'

import { sdk } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'

import RangeInput from '@/components/form/RangeInput.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'

export interface ProductFilers extends Record<string, string | string[] | undefined> {
  search: string
  sets: string[]
  tags: string[]
  available: string
  public: string
  has_cover: string
  'price.min'?: string
  'price.max'?: string
  sort?: string
}

export const EMPTY_PRODUCT_FILTERS: ProductFilers = {
  search: '',
  sets: [ALL_FILTER_VALUE],
  tags: [ALL_FILTER_VALUE],
  available: ALL_FILTER_VALUE,
  public: ALL_FILTER_VALUE,
  has_cover: ALL_FILTER_VALUE,
  has_items: ALL_FILTER_VALUE,
  has_schemas: ALL_FILTER_VALUE,
  shipping_digital: ALL_FILTER_VALUE,
  'price.min': undefined,
  'price.max': undefined,
  sort: undefined,
}

export default defineComponent({
  components: { BooleanSelect, AttributeFilterInput, RangeInput, AutocompleteInput },
  props: {
    filters: {
      type: Object as PropType<ProductFilers>,
      default: () => cloneDeep(EMPTY_PRODUCT_FILTERS),
    },
  },
  data: () => ({
    local: cloneDeep(EMPTY_PRODUCT_FILTERS),
    customFilters: [] as Attribute[],
  }),
  computed: {
    productSets() {
      return this.$accessor.productSets.getData
    },
    AttributeType(): typeof AttributeType {
      return AttributeType
    },
  },
  watch: {
    filters: {
      handler(filters: ProductFilers) {
        this.local = cloneDeep(filters)
      },
      deep: true,
    },
  },
  created() {
    this.fetchCustomFilters()
  },
  mounted() {
    this.local = { ...this.local, ...this.filters }
  },
  methods: {
    updateRangeValue(key: string, range: { min: string; max: string }) {
      this.local[`${key}.min`] = range.min
      this.local[`${key}.max`] = range.max
    },

    async fetchCustomFilters() {
      try {
        this.customFilters = await sdk.Products.getFilters()
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },

    makeSearch() {
      this.$emit('search', {
        ...this.filters,
        ...this.local,
      })
    },

    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
    clearFilters() {
      this.$emit('search', cloneDeep(EMPTY_PRODUCT_FILTERS))
    },
  },
})
</script>

<style lang="scss" scoped>
.products-filter-tags {
  &__option {
    display: flex;
    align-items: center;
  }

  &__color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    margin-right: 4px;
  }
}
</style>
