<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="consents">
      <template #nav>
        <icon-button v-can="$p.Consents.Add" to="/settings/consents/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: consent }">
        <list-item :key="consent.id" :url="`/settings/consents/${consent.id}`">
          {{ consent.name }}
          <small>{{ consent.description }}</small>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Zgody marketingowe",
    "add": "Dodaj zgodę"
  },
  "en": {
    "title": "Marketing consents",
    "add": "Add consent"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ListItem,
    PaginatedList,
  },
})
</script>
