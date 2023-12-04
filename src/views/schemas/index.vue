<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title').toString()"
      :filters="filters"
      store-key="schemas"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.ProductSets.Add" to="/schemas/create" data-cy="add-btn">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <schema-filter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item }">
        <list-item :key="item.id" :url="`/schemas/${item.id}`">
          {{ item.name }}
          <small>{{ item.description }}</small>
          <template #action>
            <small>{{ !isNil(item.product_id) ? $t('assigned') : $t('notAssigned') }}</small>
          </template>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Schematy",
    "add": "Dodaj schemat",
    "assigned": "Schemat przypisany do produktu",
    "notAssigned": "Schemat nie przypisany do produktu"
  },
  "en": {
    "title": "Schemas",
    "add": "Add schema",
    "assigned": "Schema assigned to product",
    "notAssigned": "Schema not assigned to product"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import debounce from 'lodash/debounce'
import isNil from 'lodash/isNil'

import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import SchemaFilter, {
  EMPTY_SCHEMA_FILTERS,
  SchemaFilersType,
} from '@/components/modules/schemas/SchemaFilter.vue'
import { formatFilters } from '@/utils/utils'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    SchemaFilter,
    PaginatedList,
    ListItem,
  },
  data: () => ({
    filters: {
      search: '',
      has_product: '',
    },
  }),
  created() {
    this.filters = {
      search: (this.$route.query.search as string) || '',
      has_product: (this.$route.query.has_product as string) || '',
    }
  },
  methods: {
    isNil,
    makeSearch(filters: SchemaFilersType) {
      this.filters = filters
      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'schemas',
        query: { page: undefined, ...queryFilters },
      })
    },
    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
    clearFilters() {
      this.makeSearch({ ...EMPTY_SCHEMA_FILTERS })
    },
  },
})
</script>
