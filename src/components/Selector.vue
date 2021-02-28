<template>
  <div class="schema-selector">
    <vs-input v-model="query" :label="`Wyszukaj ${typeName}`"></vs-input>

    <div ref="content" class="schema-selector__content">
      <empty v-if="query !== '' && list.length === 0">Nic nie znaleziono</empty>

      <list class="schema-selector__schemas">
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
  </div>
</template>

<script>
// import uniqBy from 'lodash/uniqBy'
import debounce from 'lodash/debounce'
import queryString from 'query-string'
import List from '@/components/List.vue'
import Empty from '@/components/Empty.vue'
import ListItem from '@/components/ListItem.vue'
import { api } from '../api'

export default {
  name: 'Selector',
  data: () => ({
    query: '',
    data: [],
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
      return this.data.filter((x) => !this.existing.find((y) => x.id === y.id)).slice(0, 5)
    },
  },
  watch: {
    query(search) {
      this.getItems(search)
    },
  },
  methods: {
    getItems: debounce(async function(search) {
      if (search === '') {
        this.data = []
        return
      }

      const loading = this.$vs.loading({
        target: this.$refs.content,
      })
      try {
        const query = queryString.stringify({
          search: search,
        })
        const { data } = await api.get(`/${this.type}?${query}`)
        this.data = data.data
        loading.close()
      } catch (error) {
        console.error(error)
        loading.close()
      }
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

<style lang="scss">
.schema-selector {
  .vs-input-parent {
    margin-bottom: 0;
  }

  &__content {
    position: relative;
  }
}
</style>
