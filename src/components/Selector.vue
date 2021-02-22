<template>
  <div class="schema-selector">
    <vs-input v-model="query" :label="`Wyszukaj ${typeName}`"></vs-input>

    <empty v-if="query !== '' && list.length === 0">Nic nie znaleziono</empty>

    <list class="schema-selector__schemas" v-if="!isLoading">
      <list-item class="schema-selector__schema" v-for="item in list" :key="item.id" no-hover>
        {{ item.name }}
        <small>{{ getSubText(item) }}</small>
        <template #action>
          <div class="flex">
            <vs-button success icon @click="onSelect(item)">
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
  name: 'Selector',
  data: () => ({
    query: '',
  }),
  props: {
    type: {
      type: String,
      default: 'schemas',
    },
    typeName: {
      type: String,
      default: 'schemat',
    },
    existing: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    list() {
      if (this.query === '') return []
      return this.$store.getters[`${this.type}/getData`]
        .filter((x) => !this.existing.find((y) => x.id === y.id))
        .slice(0, 5)
    },
    isLoading() {
      return this.$store.getters[`${this.type}/getIsLoading`]
    },
  },
  watch: {
    query(search) {
      this.getItems(search)
    },
  },
  methods: {
    getItems: debounce(function(search) {
      if (search === '') return
      this.$store.dispatch(`${this.type}/fetch`, {
        search: search,
      })
    }, 300),
    onSelect(schema) {
      this.$emit('select', schema)
    },
    getSubText(item) {
      if (this.type === 'schemas') return item.description
      if (this.type === 'items') return `SKU: ${item.sku}`
      return ''
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
