<template>
  <div>
    <PaginatedList title="Strony" store-key="pages" draggable>
      <template #nav>
        <icon-button v-can="$p.Pages.Add" to="/pages/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          Dodaj stronę
        </icon-button>
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
