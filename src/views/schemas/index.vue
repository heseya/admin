<template>
  <div>
    <PaginatedList title="Schematy" :filters="filters" storeKey="schemas">
      <template #nav>
        <vs-input
          state="dark"
          type="search"
          v-model="filters.search"
          @keydown.enter="makeSearch"
          placeholder="Wyszukiwanie"
        />

        <vs-button @click="makeSearch" color="dark" icon>
          <i class="bx bx-search"></i>
        </vs-button>
        <vs-button to="/schemas/create" color="dark" icon>
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

<script>
import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'

import { SchemaTypeLabel } from '@/interfaces/SchemaType'

export default {
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
    currency() {
      return this.$store.state.currency
    },
  },
  methods: {
    makeSearch() {
      if (this.search !== this.$route.query.search) {
        this.$router.push({
          path: 'schemas',
          query: { page: undefined, search: this.filters.search || undefined },
        })
      }
    },
  },
  created() {
    this.filters.search = this.$route.query.search || ''
  },
}
</script>
