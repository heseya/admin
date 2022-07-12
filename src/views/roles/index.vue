<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="roles">
      <template #nav>
        <icon-button v-can="$p.Roles.Add" to="/settings/roles/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: role }">
        <list-item :key="role.id" :url="`/settings/roles/${role.id}`">
          {{ role.name }}
          <small>{{ role.description }}</small>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Role",
    "add": "Dodaj rolę"
  },
  "en": {
    "title": "Roles",
    "add": "Add role"
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
