<template>
  <div>
    <PaginatedList :title="$t('title')" store-key="webhooks">
      <template #nav>
        <icon-button v-can="$p.Webhooks.Add" to="/webhooks/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: webhook }">
        <list-item :url="`/webhooks/${webhook.id}`">
          <span v-if="webhook.name"> {{ webhook.name }} | {{ webhook.url }} </span>
          <span v-else>{{ webhook.url }}</span>
          <small>{{ webhook.events.join(', ') }}</small>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Webhooki",
    "add": "Dodaj webhook"
  },
  "en": {
    "title": "Webhooks",
    "add": "Add webhook"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ListItem,
    PaginatedList,
  },
})
</script>
