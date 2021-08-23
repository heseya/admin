<template>
  <div>
    <PaginatedList title="Schematy" :filters="filters" store-key="schemas">
      <template #nav>
        <vs-input
          v-model="filters.search"
          state="dark"
          type="search"
          placeholder="Wyszukiwanie"
          @keydown.enter="makeSearch"
        />

        <vs-button color="dark" icon @click="makeSearch">
          <i class="bx bx-search"></i>
        </vs-button>
        <vs-button v-can="$p.ProductSets.Add" to="/schemas/create" color="dark" icon>
          <i class="bx bx-plus"></i>
        </vs-button>
      </template>

      <template v-slot="{ item }">
        <list-item :url="`/schemas/${item.id}`">
          {{ item.name }}
          <small>{{ item.description }}</small>
          <template #action>
            <small>{{ SchemaTypeLabel[item.type] }}</small>
          </template>
        </list-item>
      </template>
    </PaginatedList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

import { SchemaTypeLabel } from '@/consts/schemaTypeLabels'

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
  },
  data: () => ({
    filters: {
      search: '',
    },
    SchemaTypeLabel: Object.freeze(SchemaTypeLabel),
  }),
  computed: {
    currency(): string {
      return this.$accessor.currency
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
  },
  methods: {
    makeSearch() {
      if (this.filters.search !== this.$route.query.search) {
        this.$router.push({
          path: 'schemas',
          query: { page: undefined, search: this.filters.search || undefined },
        })
      }
    },
  },
})
</script>
