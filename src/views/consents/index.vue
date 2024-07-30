<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title').toString()" store-key="consents" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Consents.Add" to="/settings/consents/create">
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
    "title": "Zgody przy rejestracji",
    "add": "Dodaj zgodę",
    "consentType": {
      "user": "Zgoda użytkownika",
      "organization": "Zgoda organizacji"
    }
  },
  "en": {
    "title": "Registration consents",
    "add": "Add consent",
    "consentType": {
      "user": "User consent",
      "organization": "Organization consent"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Consent, ConsentType } from '@heseya/store-core'

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
    tableConfig(): TableConfig<Consent> {
      return {
        rowUrlBuilder: (row) => `/settings/consents/${row.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          {
            key: 'type',
            label: this.$t('common.form.type') as string,
            render: (_v, item) => {
              if (item.type === ConsentType.User) return this.$t('consentType.user') as string
              if (item.type === ConsentType.Organization)
                return this.$t('consentType.organization') as string
              return '-'
            },
          },
          { key: 'required', label: this.$t('common.form.required') as string },
        ],
      }
    },
  },
})
</script>
