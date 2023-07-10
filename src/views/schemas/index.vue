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
        <div>
          <app-input
            v-model="filters.search"
            class="span-2"
            type="search"
            :label="$t('common.search').toString()"
            allow-clear
            @input="debouncedSearch"
          />
        </div>
      </template>

      <template #default="{ item }">
        <list-item :key="item.id" :url="`/schemas/${item.id}`">
          {{ item.name }}
          <small>{{ item.description }}</small>
          <template #action>
            <small>{{ $t(`schemaTypes.${item.type}`) }}</small>
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
    "add": "Dodaj schemat"
  },
  "en": {
    "title": "Schemas",
    "add": "Add schema"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { debounce } from 'lodash'

import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    ListItem,
  },
  data: () => ({
    filters: {
      search: '',
    },
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
