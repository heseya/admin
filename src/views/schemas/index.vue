<template>
  <div class="narrower-page">
    <PaginatedList
      title="Schematy"
      :filters="filters"
      store-key="schemas"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.ProductSets.Add" to="/schemas/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj schemat
        </icon-button>
      </template>

      <template #filters>
        <div>
          <app-input
            v-model="filters.search"
            class="span-2"
            type="search"
            label="Wyszukiwanie"
            allow-clear
            @input="debouncedSearch"
          />
        </div>
      </template>

      <template #default="{ item }">
        <list-item :url="`/schemas/${item.id}`">
          {{ item.name }}
          <small>{{ item.description }}</small>
          <template #action>
            <small>{{ SchemaTypeLabel[item.type] }}</small>
          </template>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'

import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

import { SchemaTypeLabel } from '@/consts/schemaTypeLabels'

export default Vue.extend({
  metaInfo: { title: 'Schematy' },
  components: {
    PaginatedList,
    ListItem,
  },
  data: () => ({
    filters: {
      search: '',
    },
    SchemaTypeLabel: Object.freeze(SchemaTypeLabel),
  }),
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
  },
  methods: {
    makeSearch() {
      if (this.filters.search !== this.$route.query.search) {
        this.$router.push({
          path: 'schemas',
          query: { page: undefined, search: this.filters.search || undefined },
        })
      }
    },
    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),
    clearFilters() {
      this.filters.search = ''
      this.makeSearch()
    },
  },
})
</script>
