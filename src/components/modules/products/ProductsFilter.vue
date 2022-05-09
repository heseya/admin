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

    <app-select
      v-model="local.public"
      :label="$t('public')"
      add-all
      option-filter-prop="label"
      @change="debouncedSearch"
    >
      <a-select-option :value="'1'" :label="$t('common.yes')">
        {{ $t('common.yes') }}
      </a-select-option>
      <a-select-option :value="'0'" :label="$t('common.no')">
        {{ $t('common.no') }}
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n>
{
  "pl": {
    "sets": "Kolekcja",
    "tags": "Tagi",
    "public": "Widoczność"
  },
  "en": {
    "sets": "Collection",
    "tags": "Tags",
    "public": "Public"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'

import { ALL_FILTER_VALUE } from '@/consts/filters'

export const EMPTY_PRODUCT_FILTERS = {
  search: '',
  sets: [ALL_FILTER_VALUE],
  tags: [ALL_FILTER_VALUE],
  public: ALL_FILTER_VALUE,
  sort: undefined as string | undefined,
}

type ProductFilers = typeof EMPTY_PRODUCT_FILTERS

export default Vue.extend({
  props: {
    filters: {
      type: Object,
      default: () => ({ ...EMPTY_PRODUCT_FILTERS }),
    } as Vue.PropOptions<ProductFilers>,
  },
  data: () => ({
    local: { ...cloneDeep(EMPTY_PRODUCT_FILTERS) },
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
