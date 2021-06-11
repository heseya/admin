<template>
  <div>
    <ItemsPaginatedList title="Strony" storeKey="pages">
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
    </ItemsPaginatedList>
  </div>
</template>

<script>
import ListItem from '@/components/ListItem.vue'
import ItemsPaginatedList from '@/components/ItemsPaginatedList.vue'

export default {
  components: {
    ListItem,
    ItemsPaginatedList,
  },
}
</script>
