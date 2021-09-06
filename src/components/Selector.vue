<template>
  <div class="schema-selector">
    <vs-input v-model="query" :label="`Wyszukaj ${typeName}`"></vs-input>

    <div ref="content" class="schema-selector__content">
      <empty v-if="query !== '' && list.length === 0">Nic nie znaleziono</empty>

      <list class="schema-selector__items">
        <list-item v-for="item in list" :key="item.id" class="schema-selector__item" no-hover>
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

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash/debounce'

import { api } from '../api'
import { formatApiError } from '@/utils/errors'
import { stringifyQuery } from '@/utils/utils'

import List from '@/components/layout/List.vue'
import Empty from '@/components/layout/Empty.vue'
import ListItem from '@/components/layout/ListItem.vue'

import { Schema } from '@/interfaces/Schema'
import { SchemaTypeLabel } from '@/consts/schemaTypeLabels'
import { UUID } from '@/interfaces/UUID'

interface Item {
  id: UUID
  name: string
}

export default Vue.extend({
  name: 'Selector',
  components: {
    List,
    ListItem,
    Empty,
  },
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
    } as Vue.PropOptions<Item[]>,
  },
  data: () => ({
    query: '',
    data: [] as Item[],
  }),
  computed: {
    list(): Item[] {
      return this.data.filter((x) => !this.existing.find((y) => x.id === y.id))
    },
  },
  watch: {
    query(search: string) {
      this.getItems(search)
    },
  },
  methods: {
    // TODO: "this" typing is wrong
    getItems: debounce(async function (this: any, search: string) {
      if (search === '') {
        this.data = []
        return
      }

      const loading = this.$vs.loading({
        target: this.$refs.content,
      })
      try {
        const query = stringifyQuery({ search })
        const { data } = await api.get(`/${this.type}?${query}`)
        this.data = data.data
      } catch (error: any) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
      loading.close()
    }, 300),
    onSelect(item: Item) {
      this.$emit('select', item)
    },
    // TODO: better typing
    getSubText(item: any) {
      if (this.type === 'schemas') {
        const schema = item as Schema
        const schemaType = SchemaTypeLabel[schema.type]
        return schema.description ? `${schemaType} | ${schema.description}` : schemaType
      }
      if (this.type === 'items') return `SKU: ${item.sku}`
      return ''
    },
  },
})
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
