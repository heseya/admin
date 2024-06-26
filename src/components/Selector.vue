<template>
  <div class="schema-selector">
    <app-input
      ref="input"
      v-model="query"
      name="selector-search-input"
      :label="`${$t('search')} ${typeName || $t('defaultTypeName')}`"
    ></app-input>

    <div ref="content" class="schema-selector__content">
      <loading :active="isLoading" />

      <empty v-if="query !== '' && list.length === 0" />

      <list class="schema-selector__items">
        <list-item v-for="item in list" :key="item.id" class="schema-selector__item" no-hover>
          {{ item.name }}
          <small>{{ getSubText(item) }}</small>
          <template #action>
            <div class="flex">
              <app-button type="success" size="small" @click="onSelect(item)">
                {{ addText || $t('defaultAddBtn') }}
              </app-button>
            </div>
          </template>
        </list-item>
      </list>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "search": "Wyszukaj",
    "defaultTypeName": "schemat",
    "defaultAddBtn": "Dodaj",
    "slug": "Link"
  },
  "en": {
    "search": "Search",
    "defaultTypeName": "schema",
    "defaultAddBtn": "Add",
    "slug": "Slug"
  }
}
</i18n>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import debounce from 'lodash/debounce'
import { Schema, Attribute, WarehouseItem, Product } from '@heseya/store-core'

import { api } from '../api'
import { formatApiNotificationError } from '@/utils/errors'
import { stringifyQueryParams } from '@/utils/stringifyQuery'

import List from '@/components/layout/List.vue'
import Empty from '@/components/layout/Empty.vue'
import ListItem from '@/components/layout/ListItem.vue'

import { UUID } from '@/interfaces/UUID'
import Loading from './layout/Loading.vue'

interface Item {
  id: UUID
  name: string
}

export default defineComponent({
  name: 'Selector',
  components: {
    List,
    ListItem,
    Empty,
    Loading,
  },
  props: {
    type: {
      type: String,
      default: 'schemas',
    },
    typeName: {
      type: String,
      default: null,
    },
    addText: {
      type: String,
      default: null,
    },
    existing: {
      type: Array as PropType<Item[]>,
      default: () => [],
    },
    autofocus: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    query: '',
    isLoading: false,
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
  mounted() {
    if (this.autofocus) (this.$refs.input as any)?.focus()
  },
  methods: {
    getItems: debounce(async function (this: any, search: string) {
      if (search === '') {
        this.data = []
        return
      }

      this.isLoading = true
      try {
        const query = stringifyQueryParams({ search, lang_fallback: 'any' })
        const { data } = await api.get<{ data: Item[] }>(`/${this.type}${query}`)
        this.data = data.data
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      }
      this.isLoading = false
    }, 300),
    onSelect(item: Item) {
      this.$emit('select', item)
    },

    getSubText(item: unknown) {
      if (this.type === 'schemas') {
        const schema = item as Schema
        const schemaType = this.$t(`schemaTypes.${schema.type}`)
        return schema.description ? `${schemaType} | ${schema.description}` : schemaType
      }
      if (this.type === 'items') return `SKU: ${(item as WarehouseItem).sku}`
      if (this.type === 'attributes')
        return `${this.$t('common.form.type')}: ${this.$t(
          'attributeTypes.' + (item as Attribute).type,
        )}`
      if (this.type === 'products') return `${this.$t('slug')}: ${(item as Product).slug}`
      return ''
    },
  },
})
</script>

<style lang="scss">
.schema-selector {
  &__content {
    position: relative;
  }

  &__items {
    max-height: 350px;
    overflow: auto;
  }
}
</style>
