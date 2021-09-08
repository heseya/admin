<template>
  <div>
    <PaginatedList title="Role" store-key="roles">
      <template #nav>
        <icon-button v-can="$p.Roles.Add" to="/settings/roles/create">
          <i slot="icon" class="bx bx-plus"></i>
          Dodaj rolę
        </icon-button>
      </template>

      <template #default="{ item: role }">
        <list-item :url="`/settings/roles/${role.id}`">
          {{ role.name }}
          <small>{{ role.description }}</small>
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
  metaInfo: { title: 'Role' },
  components: {
    ListItem,
    PaginatedList,
  },
})
</script>
