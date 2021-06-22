<template>
  <div class="schema-selector">
    <vs-input v-model="query" :label="`Wyszukaj ${typeName}`"></vs-input>

    <div ref="content" class="schema-selector__content">
      <empty v-if="query !== '' && list.length === 0">Nic nie znaleziono</empty>

      <list class="schema-selector__items">
        <list-item class="schema-selector__item" v-for="item in list" :key="item.id" no-hover>
          {{ item.name }}
          <small>{{ getSubText(item) }}</small>
          <template #action>
            <div class="flex">
              <vs-button success icon @click.stop.prevent="onSelect(item)">
                {{ addText }}
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
import List from '@/components/layout/List.vue'
import Empty from '@/components/layout/Empty.vue'
import ListItem from '@/components/layout/ListItem.vue'
import { SchemaTypeLabel } from '@/interfaces/SchemaType'
import { api } from '../api'
import { formatApiError } from '@/utils/errors'

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
    addText: {
      type: String,
      default: 'Dodaj',
    },
    existing: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    list() {
      return this.data.filter((x) => !this.existing.find((y) => x.id === y.id))
    },
  },
  watch: {
    query(search) {
      this.getItems(search)
    },
  },
  methods: {
    getItems: debounce(async function (search) {
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
      } catch (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
      loading.close()
    }, 300),
    onSelect(schema) {
      this.$emit('select', schema)
    },
    getSubText(item) {
      if (this.type === 'schemas') {
        return `${SchemaTypeLabel[item.type]} | ${item.description}`
      }
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

  &__items {
    max-height: 350px;
    overflow: auto;
  }
}
</style>
