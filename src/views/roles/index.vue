<template>
  <div>
    <PaginatedList title="Role" store-key="roles">
      <template #nav>
        <icon-button v-can="$p.Roles.Add" to="/settings/roles/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj rolę
        </icon-button>
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
import IconButton from '@/components/layout/IconButton.vue'

export default Vue.extend({
  components: {
    ListItem,
    PaginatedList,
    IconButton,
  },
})
</script>
