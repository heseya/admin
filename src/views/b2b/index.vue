<template>
  <div class="b2b-organization-list-view">
    <PaginatedList store-key="b2bOrganizations" :table="tableConfig" :filters="filters">
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
        <icon-button v-can="$p.Organizations.Add" @click="isCreateModalActive = true">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
    </PaginatedList>

    <OrganizationEditForm
      :visible="isCreateModalActive"
      @close="isCreateModalActive = false"
      @saved="handleCreateOrganization"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Lista organizacji",
    "titlePrefix": "B2B",
    "add": "Dodaj organizację",
    "table": {
      "company_name": "Nazwa firmy",
      "billing_address": "Adres firmy",
      "billing_email": "Email do faktur",
      "client_id": "ID klienta",
      "vat": "NIP",
      "sales_channel": "Kanał sprzedaży"
    }
  },
  "en": {
    "title": "List of organizations",
    "titlePrefix": "B2B",
    "add": "Add organization",
    "table": {
      "company_name": "Company name",
      "billing_address": "Company address",
      "billing_email": "Email for invoices",
      "client_id": "Client ID",
      "vat": "VAT ID",
      "sales_channel": "Sales channel"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Organization, OrganizationListed } from '@heseya/store-core'
import { debounce } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import OrganizationEditForm from '@/components/modules/b2b/OrganizationEditForm.vue'
import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    OrganizationEditForm,
  },
  data: () => ({
    isCreateModalActive: false,
    filters: {
      search: '',
    },
  }),

  computed: {
    tableConfig(): TableConfig<Organization> {
      return {
        rowUrlBuilder: (row) => `/b2b/organizations/${row.id}`,
        headers: [
          {
            key: 'client_id',
            label: this.$t('table.client_id') as string,
            width: '10%', // Set width to evenly distribute columns
            render: (val) => val || '-',
          },
          {
            key: 'company_name',
            label: this.$t('table.company_name') as string,
            width: '15%', // Set width to evenly distribute columns
            render: (_v, row) => row.billing_address.company_name || row.billing_address.name,
          },
          {
            key: 'billing_address',
            label: this.$t('table.billing_address') as string,
            width: '35%', // Set width to evenly distribute columns
            render: (_v, row) => {
              if (!row.billing_address) return '-'
              return `${row.billing_address.address}, ${row.billing_address.zip} ${row.billing_address.city}, ${row.billing_address.country_name}`
            },
          },
          {
            key: 'vat',
            label: this.$t('table.vat') as string,
            label: this.$t('table.billing_address') as string,
            width: '10%', // Set width to evenly distribute columns
            render: (_v, row) => row.billing_address?.vat || '-',
          },
          { key: 'billing_email', label: this.$t('table.billing_email') as string, width: '20%' },
          {
            key: 'sales_channel',
            label: this.$t('table.sales_channel') as string,
            width: '10%',
            render: (_v, row) => row.sales_channel?.name || '-',
          },
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

    handleCreateOrganization(org: OrganizationListed) {
      this.isCreateModalActive = false
      this.$router.push({ path: `/b2b/organizations/${org.id}` })
    },
  },
})
</script>
<style lang="scss">
.b2b-organization-list-view {
  .cms-table-row__col {
    .cms-table-row__col-value {
      word-wrap: break-word;
    }
  }
}
</style>
