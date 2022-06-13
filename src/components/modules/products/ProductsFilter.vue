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

    <app-select
      v-model="local.sets[0]"
      :label="$t('sets')"
      add-all
      show-search
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="set in productSets" :key="set.slug" :label="set.name">
        {{ set.name }}&nbsp;<small>(/{{ set.slug }})</small>
      </a-select-option>
    </app-select>

    <app-select
      v-model="local.tags[0]"
      :label="$t('tags')"
      add-all
      show-search
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option v-for="{ id, name, color } in apiTags" :key="id" :label="name">
        <div class="products-filter-tags__option">
          <div class="products-filter-tags__color" :style="{ backgroundColor: `#${color}` }"></div>
          {{ name }}
        </div>
      </a-select-option>
    </app-select>

    <boolean-select v-model="local.available" :label="$t('available')" @change="debouncedSearch" />
    <boolean-select v-model="local.public" :label="$t('public')" @change="debouncedSearch" />
    <boolean-select v-model="local.has_cover" :label="$t('has_cover')" @change="debouncedSearch" />

    <app-input
      v-model="local['price.min']"
      type="number"
      :label="$t('price.min')"
      min="0"
      default-value="0"
      :addon-after="$accessor.currency"
      @input="debouncedSearch"
    />
    <app-input
      v-model="local['price.max']"
      type="number"
      :label="$t('price.max')"
      min="0"
      default-value="0"
      :addon-after="$accessor.currency"
      @input="debouncedSearch"
    />
  </div>
</template>

<i18n>
{
  "pl": {
    "sets": "Kolekcja",
    "tags": "Tagi",
    "public": "Widoczność",
    "available": "Dostępne",
    "has_cover": "Posiada okładkę",
    "price": {
      "min": "Cena minimalna",
      "max": "Cena maksymalna"
    }
  },
  "en": {
    "sets": "Collection",
    "tags": "Tags",
    "public": "Public",
    "available": "Available",
    "has_cover": "Has cover",
    "price": {
      "min": "Minimal price",
      "max": "Maximal price"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import BooleanSelect from '@/components/form/BooleanSelect.vue'

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  sets: [ALL_FILTER_VALUE],
  tags: [ALL_FILTER_VALUE],
  available: ALL_FILTER_VALUE,
  public: ALL_FILTER_VALUE,
  has_cover: ALL_FILTER_VALUE,
  'price.min': undefined as number | undefined,
  'price.max': undefined as number | undefined,
  sort: undefined as string | undefined,
}

type ProductFilers = typeof EMPTY_PRODUCT_FILTERS

export default Vue.extend({
  components: { BooleanSelect },
  props: {
    filters: {
      type: Object,
      default: () => cloneDeep(EMPTY_PRODUCT_FILTERS),
    } as Vue.PropOptions<ProductFilers>,
  },
  data: () => ({
    local: cloneDeep(EMPTY_PRODUCT_FILTERS),
  }),
  computed: {
    productSets() {
      return this.$accessor.productSets.getData
    },
    apiTags() {
      return this.$accessor.tags.getData
    },
  },
  watch: {
    filters(filters: ProductFilers) {
      this.local = { ...this.local, ...filters }
    },
  },
  created() {
    this.$accessor.productSets.fetch({ tree: undefined })
    this.$accessor.tags.fetch({ limit: 500 })
  },
  mounted() {
    this.local = { ...this.local, ...this.filters }
  },
  methods: {
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
