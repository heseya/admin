<template>
  <div>
    <PaginatedList title="Strony" storeKey="pages">
      <template #nav>
        <vs-button to="/pages/create" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: page }">
        <list-item :url="`/pages/${page.id}`" :hidden="!page.public">
          {{ page.name }}
          <small>/{{ page.slug }}</small>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<script>
import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

export default {
  components: {
    ListItem,
    PaginatedList,
  },
}
</script>
