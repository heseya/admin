<template>
  <div>
    <PaginatedList
      :title="$t('title')"
      :filters="filters"
      :table="tableConfig"
      :xlsx-file-config="fileConfig"
      store-key="users"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #filters>
        <users-filter :filters="filters" @search="makeSearch" />
      </template>
      <template #nav>
        <icon-button v-can="$p.Users.Add" to="/settings/users/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
      <template #default="{ item: user }">
        <cms-table-row
          :key="user.id"
          :item="user"
          :headers="tableConfig.headers"
          :to="`/settings/users/${user.id}`"
        >
          <template #name>
            <div class="list-item">
              <div class="list-item__avatar">
                <avatar>
                  <img :src="user.avatar" alt="" />
                </avatar>
              </div>
              <div class="list-item__content">
                {{ user.name }}
              </div>
            </div>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Użytkownicy",
    "add": "Dodaj użytkownika",
    "table": {
      "email": "E-mail",
      "roles": "Role",
      "isTfaActive": "Aktywne 2FA",
      "createdAt": "Data rejestracji"
    }
  },
  "en": {
    "title": "Users",
    "add": "Add user",
    "table": {
      "email": "E-mail",
      "roles": "Roles",
      "isTfaActive": "Active 2FA",
      "createdAt": "Registration date"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Role, User } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import Avatar from '@/components/layout/Avatar.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import UsersFilter, { EMPTY_USER_FILTERS } from '@/components/modules/users/UsersFilter.vue'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import { formatFilters } from '@/utils/utils'
import { TableConfig } from '@/interfaces/CmsTable'
import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'
import { formatDate } from '@/utils/dates'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    Avatar,
    CmsTableRow,
    UsersFilter,
  },

  data: () => ({
    filters: { ...EMPTY_USER_FILTERS },
  }),

  computed: {
    tableConfig(): TableConfig<User> {
      return {
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name') as string,
            width: '1.6fr',
            sortable: true,
          },
          { key: 'email', label: this.$t('table.email') as string, width: '1.8fr' },
          {
            key: 'roles',
            label: this.$t('table.roles') as string,
            width: '1fr',
            render: (_v, item) => {
              return item.roles.length ? item.roles.map((r) => r.name).join(', ') : '-'
            },
          },
          {
            key: 'is_tfa_active',
            label: this.$t('table.isTfaActive') as string,
            width: '0.6fr',
            render: (_v, item) => item.is_tfa_active,
          },
          {
            key: 'created_at',
            label: this.$t('table.createdAt') as string,
            render: (_v, item) => formatDate(item.created_at) as string,
          },
        ],
      }
    },

    fileConfig(): XlsxFileConfig<User> {
      return {
        name: this.$t('title') as string,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'email', label: this.$t('table.email') as string },
          {
            key: 'roles',
            label: this.$t('table.roles') as string,
            format: (v: Role[]) => v.map((role) => role.name).join(', '),
          },
          {
            key: 'is_tfa_active',
            label: this.$t('table.isTfaActive') as string,
            format: (v: boolean) => (v ? this.$t('common.yes') : this.$t('common.no')) as string,
          },
          { key: 'created_at', label: this.$t('table.createdAt') as string },
        ],
      }
    },
  },

  created() {
    const { roles, search, consent_id: consentId } = this.$route.query
    this.filters.search = (search as string) || ''
    this.filters.roles = (Array.isArray(roles) ? (roles as string[]) : [roles]).filter(Boolean)
    this.filters.consent_id = (consentId as string) || ALL_FILTER_VALUE
  },
  methods: {
    makeSearch(filters: typeof EMPTY_USER_FILTERS) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'users',
        query: { page: undefined, ...queryFilters },
      })
    },
    clearFilters() {
      this.makeSearch({ ...EMPTY_USER_FILTERS })
    },
  },
})
</script>

<style lang="scss" scoped>
.list-item {
  display: flex !important;
  align-items: center;

  &__content {
    width: 100%;
    font-weight: 600;
  }

  &__avatar {
    margin-right: 13px;
  }
}
</style>
