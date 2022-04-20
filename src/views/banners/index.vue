<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="banners">
      <template #nav>
        <icon-button v-can="$p.Banners.Add" to="/settings/banners/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: role }">
        <list-item :key="role.id" :url="`/settings/banners/${role.id}`">
          {{ role.name }}
          <small>{{ role.description }}</small>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Bannery",
    "add": "Dodaj banner"
  },
  "en": {
    "title": "Banners",
    "add": "Add banner"
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
