<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title').toString()" store-key="roles" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Roles.Add" to="/settings/roles/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Role",
    "add": "Dodaj rolę",
    "table": {
      "isRegistrationRole": "Czy można zarejestrować się z tą rolą?",
      "isJoinableRole": "Czy można dołączyć do tej roli?",
      "usersCount": "Liczba użytkowników"
    }
  },
  "en": {
    "title": "Roles",
    "add": "Add role",
    "table": {
      "isRegistrationRole": "Can register with this role?",
      "isJoinableRole": "Can join to this role?",
      "usersCount": "Users count"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Role } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'

import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
  },

  computed: {
    tableConfig(): TableConfig<Role> {
      return {
        rowOnClick: (role) => this.$router.push(`/settings/roles/${role.id}`),
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'is_registration_role', label: this.$t('table.isRegistrationRole') as string },
          { key: 'is_joinable', label: this.$t('table.isJoinableRole') as string },
          { key: 'users_count', label: this.$t('table.usersCount') as string },
        ],
      }
    },
  },
})
</script>
