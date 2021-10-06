<template>
  <div>
    <PaginatedList title="WebHooki" store-key="webhooks">
      <template #nav>
        <icon-button v-can="$p.Webhooks.Add" to="/webhooks/create">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj webhook
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

<script lang="ts">
import Vue from 'vue'
import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

export default Vue.extend({
  metaInfo: { title: 'WebHooki' },
  components: {
    ListItem,
    PaginatedList,
  },
})
</script>
