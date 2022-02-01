<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="pages" draggable>
      <template #nav>
        <icon-button v-can="$p.Pages.Add" to="/pages/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: page }">
        <list-item :key="page.id" :url="`/pages/${page.id}`" :hidden="!page.public">
          {{ page.name }}
          <small>/{{ page.slug }}</small>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Strony",
    "add": "Dodaj stronę"
  },
  "en": {
    "title": "Pages",
    "add": "Add page"
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
