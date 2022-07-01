<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="providers" :filters="{}">
      <template #nav> </template>
      <template #default="{ item: provider }">
        <list-item :key="provider.key" @click="openModal(provider.key)">
          {{ provider.key }}
          <template #action>
            <boolean-tag
              :value="provider.active"
              :true-text="$t('common.active')"
              :false-text="$t('common.inactive')"
            />
          </template>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Logowanie przez social media"
  },
  "en": {
    "title": "Login via social media"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import { UUID } from '@/interfaces/UUID'
export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    ListItem,
  },
  data: () => ({
    isModalActive: false,
    editedItem: {} as any,
  }),
  methods: {
    openModal(id: UUID) {
      this.isModalActive = true
      this.editedItem = this.$accessor.providers.getFromListById(id)
    },
  },
})
</script>
