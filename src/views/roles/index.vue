<template>
  <div>
    <PaginatedList title="Role" storeKey="roles">
      <template #nav>
        <vs-button to="/settings/roles/create" v-can="$p.Roles.Add" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: role }">
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
  components: {
    ListItem,
    PaginatedList,
  },
})
</script>
