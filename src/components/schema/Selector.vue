<template>
  <div class="schema-selector">
    <vs-input v-model="query" label="Wyszukaj schemat"></vs-input>

    <empty v-if="query !== '' && schemas.length === 0">Nie znaleziono żadnego schematu</empty>

    <list class="schema-selector__schemas">
      <list-item
        class="schema-selector__schema"
        v-for="schema in schemas"
        :key="schema.id"
        no-hover
      >
        {{ schema.name }}
        <small>{{ schema.description }}</small>
        <template #action>
          <div class="flex">
            <vs-button success icon @click="onSelect(schema)">
              Dodaj
            </vs-button>
          </div>
        </template>
      </list-item>
    </list>
  </div>
</template>

<script>
// import uniqBy from 'lodash/uniqBy'
import debounce from 'lodash/debounce'
import List from '@/components/List.vue'
import Empty from '@/components/Empty.vue'
import ListItem from '@/components/ListItem.vue'

export default {
  name: 'SchemasSelector',
  data: () => ({
    query: '',
  }),
  props: {
    existing: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    schemas() {
      if (this.query === '') return []
      return this.$store.getters['schemas/getData']
        .filter((x) => !this.existing.find((y) => x.id === y.id))
        .slice(0, 5)
    },
  },
  watch: {
    query(search) {
      this.getSchemas(search)
    },
  },
  methods: {
    getSchemas: debounce(function(search) {
      if (search === '') return
      this.$store.dispatch('schemas/fetch', {
        search: search,
      })
    }, 300),
    onSelect(schema) {
      this.$emit('select', schema)
    },
  },
  components: {
    List,
    ListItem,
    Empty,
  },
}
</script>

<style lang="scss" scoped>
.schema-selector {
  .vs-input-parent {
    margin-bottom: 0;
  }
}
</style>
