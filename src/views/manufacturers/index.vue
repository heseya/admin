<template>
  <div>
    <PaginatedList
      :title="$t('title').toString()"
      store-key="manufacturers"
      :table="tableConfig"
      :filters="filters"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.Manufacturers.Add" to="/manufacturers/create">
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

      <template #default="{ item: manufacture }">
        <cms-table-row
          :key="manufacture.id"
          :item="manufacture"
          :headers="tableConfig.headers"
          :to="`/manufacturers/${manufacture.id}`"
        >
          <template #name>
            <b>{{ manufacture.name }}</b>
          </template>
          <template #first_name>
            <small>{{ manufacture.first_name }}</small>
          </template>
          <template #last_name>
            <p>{{ manufacture.last_name }}</p>
          </template>
          <template #email>
            <p>{{ manufacture.email }}</p>
          </template>
          <template #address>
            <p>
              {{ manufacture.address.address }}, {{ manufacture.address.zip }}
              {{ manufacture.address.city }}, {{ manufacture.address.country }}
            </p>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Producenci",
    "add": "Dodaj producenta",
    "table": {
      "firstName": "Imię",
      "lastName": "Nazwisko",
      "email": "Email",
      "address": "Adres",
      "active": "Aktywny"
    }
  },
  "en": {
    "title": "Manufacturers",
    "add": "Add manufacture",
    "table": {
      "firstName": "First name",
      "lastName": "Last name",
      "email": "Email",
      "address": "Address",
      "active": "Active"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { debounce } from 'lodash'
import { Manufacturer } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },

  components: {
    PaginatedList,
    CmsTableRow,
  },

  data: () => ({
    filters: {
      search: '',
    },
  }),

  computed: {
    tableConfig(): TableConfig<Manufacturer> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'first_name', label: this.$t('table.firstName') as string },
          { key: 'last_name', label: this.$t('table.lastName') as string },
          { key: 'email', label: this.$t('table.email') as string },
          { key: 'address', label: this.$t('table.address') as string },
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
          path: '/manufacturers',
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
