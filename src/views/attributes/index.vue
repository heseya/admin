<template>
  <div>
    <PaginatedList
      :title="$t('title').toString()"
      :filters="filters"
      :table="tableConfig"
      store-key="attributes"
      draggable
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.Attributes.Add" to="/settings/attributes/create" data-cy="add-btn">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <AttributesFilter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: attribute }">
        <cms-table-row
          :key="attribute.id"
          :item="attribute"
          :headers="tableConfig.headers"
          :to="`/settings/attributes/${attribute.id}`"
          draggable
        >
          <template #name="{ value }">
            {{ value }}
            ( <code>{{ attribute.slug }}</code> )
          </template>
          <template #description="{ value }">
            <small>{{ value || '-' }}</small>
          </template>
          <template #type="{ value }">
            <i>{{ $t('attributeTypes.' + value) }}</i>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Atrybuty produktów",
    "add": "Dodaj cechę",
    "form": {
      "global": "Globalny",
      "sortable": "Sortowalny",
      "includeInSearch": "Uwzględniony w wyszukiwarce"
    }
  },
  "en": {
    "title": "Attributes",
    "add": "Add attribute",
    "form": {
      "global": "Global",
      "sortable": "Sortable",
      "includeInSearch": "Included in search"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { debounce } from 'lodash'
import { Attribute } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import AttributesFilter, {
  AttributesFilersType,
} from '@/components/modules/attributes/AttributesFilter.vue'

import { TableConfig } from '@/interfaces/CmsTable'
import { ALL_FILTER_VALUE } from '@/consts/filters'
import { formatFilters } from '@/utils/utils'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    CmsTableRow,
    AttributesFilter,
  },
  data: () => ({
    filters: {
      search: '',
      global: ALL_FILTER_VALUE,
      sortable: ALL_FILTER_VALUE,
    },
  }),
  computed: {
    tableConfig(): TableConfig<Attribute> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          {
            key: 'description',
            label: this.$t('common.form.description') as string,
            width: '1.6fr',
          },
          { key: 'type', label: this.$t('common.form.type') as string, width: '0.6fr' },
          {
            key: 'include_in_text_search',
            label: this.$t('form.includeInSearch') as string,
            width: '0.6fr',
          },
          { key: 'sortable', label: this.$t('form.sortable') as string, width: '0.6fr' },
          { key: 'global', label: this.$t('form.global') as string, width: '0.6fr' },
        ],
      }
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.global = (this.$route.query.global as string) || ALL_FILTER_VALUE
    this.filters.sortable = (this.$route.query.sortable as string) || ALL_FILTER_VALUE
  },
  methods: {
    makeSearch(filters: AttributesFilersType) {
      this.filters = filters
      const queryFilters = formatFilters(this.filters)

      this.$router.push({
        path: '/settings/attributes',
        query: { ...queryFilters, page: undefined },
      })
    },

    debouncedSearch: debounce(function (this: any) {
      this.$nextTick(() => {
        this.makeSearch()
      })
    }, 300),

    clearFilters() {
      this.makeSearch({ search: '', global: ALL_FILTER_VALUE, sortable: ALL_FILTER_VALUE })
    },
  },
})
</script>
