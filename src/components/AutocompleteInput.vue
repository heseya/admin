<template>
  <div class="autocomplete-input">
    <ValidationProvider ref="provider" v-slot="{ errors }" :rules="rules">
      <app-select
        :value="antSelectValue"
        :label="label"
        :mode="mode"
        :name="`autocomplete-${model}`"
        class="autocomplete-input__select"
        option-filter-prop="label"
        :disabled="disabled"
        show-search
        allow-clear
        label-in-value
        :loading="isLoading"
        :placeholder="`${$t('placeholder')}`"
        @search="onSearch"
        @select="onSelect"
        @deselect="onDeselect"
      >
        <a-select-option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
          :label="option.name || option.code"
        >
          {{ option.name || option.code }}
        </a-select-option>

        <template #notFoundContent>
          <empty />
        </template>

        <template #error>
          {{ errors[0] }}
        </template>
      </app-select>
    </ValidationProvider>
  </div>
</template>

<i18n>
{
  "pl": {
    "placeholder": "Zacznij pisać, aby wyszukać"
  },
  "en": {
    "placeholder": "Start typing to search"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import { ValidationProvider } from 'vee-validate'

import { api } from '@/api'
import { GeneratedStoreModulesKeys } from '@/store'
import Empty from '@/components/layout/Empty.vue'
import { UUID } from '@/interfaces/UUID'

interface BaseItem {
  id: UUID
  name?: string
  code?: string
}

type AntSelectOption = { key: string; label: string }

export default Vue.extend({
  components: { Empty, ValidationProvider },
  props: {
    model: {
      type: String,
      required: true,
    } as Vue.PropOptions<GeneratedStoreModulesKeys>,
    value: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<BaseItem[]>,
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
    placeholderModel: { type: String, default: '' },
    rules: { type: [String, Object], default: null },
    mode: { type: String, default: 'multiple' },
    api: { type: Boolean, default: false },
    filterItems: { type: Array, default: () => [] },
  },
  data: () => ({
    isLoading: false,
    apiOptions: [] as BaseItem[],
  }),
  computed: {
    selectedItems: {
      get(): BaseItem[] {
        return this.value
      },
      set(v: BaseItem[]) {
        this.$emit('input', v)
      },
    },
    options(): BaseItem[] {
      if (!this.api)
        return uniqBy([...this.selectedItems, ...this.$accessor[this.model].getData], 'id') || []
      else return this.apiOptions
    },
    antSelectValue(): AntSelectOption[] {
      return this.selectedItems.map((item) => ({
        key: item.id,
        label: item.name || item.code!,
      }))
    },
  },
  mounted() {
    if (!this.api) this.fetchItems()
  },
  methods: {
    onSearch: debounce(function (this: any, search: string) {
      this.api ? this.fetchItemsFromApi(search) : this.fetchItems(search)
    }, 500),

    onDeselect({ key }: AntSelectOption) {
      this.selectedItems = this.selectedItems.filter(({ id }) => id !== key)
    },

    onSelect(option: AntSelectOption) {
      this.selectedItems = [
        ...this.selectedItems,
        this.options.find(({ id }) => id === option.key)!,
      ]
    },

    async fetchItems(query?: string) {
      this.isLoading = true
      await this.$accessor[this.model].fetch({ search: query, tree: 0 })
      this.isLoading = false
    },
    async fetchItemsFromApi(query?: string) {
      this.isLoading = true
      const {
        data: { data: data },
      } = await api.get<{ data: BaseItem[] }>(`/${this.model}?search=${query}`)

      this.apiOptions = [...data].filter((item) => !this.filterItems.includes(item.id))
      this.isLoading = false
    },
  },
})
</script>
