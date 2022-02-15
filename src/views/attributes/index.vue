<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title')"
      :filters="filters"
      :table="tableConfig"
      store-key="attributes"
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
        <div>
          <app-input
            v-model="filters.search"
            class="span-2"
            type="search"
            :label="$t('common.search')"
            allow-clear
            @input="debouncedSearch"
          />
        </div>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Cechy produktów",
    "add": "Dodaj cechę",
    "form": {
      "global": "Globalny"
    }
  },
  "en": {
    "title": "Attributes",
    "add": "Add attribute",
    "form": {
      "global": "Global"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import { Attribute } from '@/interfaces/Attribute'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
  },
  data: () => ({
    filters: {
      search: '',
    },
  }),
  computed: {
    tableConfig(): TableConfig<Attribute> {
      return {
        rowUrlBuilder: (order) => `/attributes/${order.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'description', label: this.$t('common.form.description') as string },
          { key: 'type', label: this.$t('common.form.type') as string, width: '0.8fr' },
          { key: 'global', label: this.$t('form.global') as string, width: '0.8fr' },
        ],
      }
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
  },
  methods: {
    makeSearch() {
      if (this.filters.search !== this.$route.query.search) {
        this.$router.push({
          path: '/settings/attributes',
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
