<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title').toString()"
      store-key="pages"
      draggable
      :table="tableConfig"
      :filters="filters"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <PagesFilters :filters="filters" @search="makeSearch" />
      </template>

      <template #nav>
        <icon-button v-can="$p.Pages.Add" to="/pages/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: page }">
        <CmsTableRow
          :key="page.id"
          :item="page"
          :headers="tableConfig.headers"
          :to="`/pages/${page.id}`"
          draggable
        >
          <template #slug="{ value }">
            <code>{{ value }}</code>
          </template>
        </CmsTableRow>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Strony",
    "add": "Dodaj stronę"
  },
  "en": {
    "title": "Pages",
    "add": "Add page"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Page } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import PagesFilters, {
  PagesFiltersType,
  EMPTY_MEDIA_FILTERS,
} from '@/components/modules/pages/Filters.vue'
import { formatFilters } from '@/utils/utils'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    CmsTableRow,
    PaginatedList,
    PagesFilters,
  },

  data: () => ({
    filters: {
      ...EMPTY_MEDIA_FILTERS,
    } as PagesFiltersType,
  }),

  computed: {
    tableConfig(): TableConfig<Page> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string, width: '2fr' },
          { key: 'slug', label: this.$t('common.form.slug') as string, width: '3fr' },
          { key: 'public', label: this.$t('common.form.visibility') as string, width: '1fr' },
        ],
      }
    },
  },

  created() {
    const { search } = this.$route.query
    this.filters.search = search?.toString() || ''
  },

  methods: {
    makeSearch(filters: PagesFiltersType) {
      this.filters = filters
      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'pages',
        query: { ...queryFilters, page: undefined },
      })
    },
    clearFilters(): void {
      this.makeSearch({ ...EMPTY_MEDIA_FILTERS })
    },
  },
})
</script>
