<template>
  <div class="narrower-page">
    <PaginatedList store-key="b2bCompanies" :table="tableConfig" :filters="filters">
      <template #title>
        <span class="gray-text">{{ $t('titlePrefix') }}</span> &nbsp; <span>{{ $t('title') }}</span>
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

      <template #nav>
        <icon-button v-can="$p.Roles.Add" @click="isCreateModalActive = true">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
    </PaginatedList>

    <company-form :visible="isCreateModalActive" @close="isCreateModalActive = false" />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Lista firm",
    "titlePrefix": "B2B",
    "add": "Dodaj firmę",
    "table": {
      "users_count": "Liczba użytkowników"
    }
  },
  "en": {
    "title": "List of companies",
    "titlePrefix": "B2B",
    "add": "Add company",
    "table": {
      "users_count": "Number of users"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Role } from '@heseya/store-core'
import { debounce } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import CompanyForm from '@/components/modules/b2b/CompanyForm.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    CompanyForm,
  },
  data: () => ({
    isCreateModalActive: false,
    filters: {
      search: '',
    },
  }),

  computed: {
    tableConfig(): TableConfig<Role> {
      return {
        rowUrlBuilder: (row) => `/b2b/companies/${row.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          {
            key: 'description',
            label: this.$t('common.form.description') as string,
            render: (v) => v || '-',
          },
          { key: 'users_count', label: this.$t('table.users_count') as string },
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
          path: this.$route.path,
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
