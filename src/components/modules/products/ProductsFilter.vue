<template>
  <div class="products-filter">
    <app-input
      v-model="local.search"
      class="span-2"
      type="search"
      :label="$t('common.search')"
      allow-clear
      @input="debouncedSearch"
    />

    <autocomplete-input
      v-model="local.sets"
      prop-mode="slug"
      model-url="product-sets"
      :label="$t('sets')"
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
      :label="$t('tags')"
      @input="debouncedSearch"
    >
      <template #option="{ name, color }">
        <div class="products-filter-tags__option">
          <div class="products-filter-tags__color" :style="{ backgroundColor: `#${color}` }"></div>
          {{ name }}
        </div>
      </template>
    </autocomplete-input>

    <boolean-select v-model="local.available" :label="$t('available')" @change="debouncedSearch" />
    <boolean-select v-model="local.public" :label="$t('public')" @change="debouncedSearch" />
    <boolean-select v-model="local.has_cover" :label="$t('has_cover')" @change="debouncedSearch" />

    <range-input
      :value="{ min: local['price.min'], max: local['price.max'] }"
      :label="$t('price')"
      :addon-after="$accessor.currency"
      min="0"
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
    "price": "Cena"
  },
  "en": {
    "sets": "Collection",
    "tags": "Tags",
    "public": "Public",
    "available": "Available",
    "has_cover": "Has cover",
    "price": "Price"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import AttributeFilterInput from './AttributeFilterInput.vue'
import BooleanSelect from '@/components/form/BooleanSelect.vue'

import { api } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'

import { Attribute, AttributeType } from '@/interfaces/Attribute'
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
  'price.min': undefined,
  'price.max': undefined,
  sort: undefined,
}

export default Vue.extend({
  components: { BooleanSelect, AttributeFilterInput, RangeInput, AutocompleteInput },
  props: {
    filters: {
      type: Object,
      default: () => cloneDeep(EMPTY_PRODUCT_FILTERS),
    } as Vue.PropOptions<ProductFilers>,
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
        const { data } = await api.get<{ data: Attribute[] }>('/filters')
        this.customFilters = data.data
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
