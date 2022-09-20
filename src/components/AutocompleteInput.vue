<template>
  <div class="autocomplete-input">
    <ValidationProvider ref="provider" v-slot="{ errors }" :rules="rules">
      <app-select
        :value="inputValue"
        :label="label"
        :mode="mode"
        :name="`autocomplete-${modelUrl}`"
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
        @input="onInput"
        @deselect="onDeselect"
      >
        <a-select-option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
          :label="option.name || option.code"
        >
          <slot name="option" v-bind="option"> {{ option.name || option.code }} </slot>
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

<i18n lang="json">
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
import isEmpty from 'lodash/isEmpty'
import { ValidationProvider } from 'vee-validate'

import { api } from '@/api'
import Empty from '@/components/layout/Empty.vue'
import { UUID } from '@/interfaces/UUID'
import { SelectType } from '@/enums/select'

interface BaseItem {
  id: UUID
  name?: string
  code?: string
}

type AntSelectOption = { key: string; label: string }

export default Vue.extend({
  components: { Empty, ValidationProvider },
  props: {
    value: {
      type: [String, Object, Array],
      default: () => [],
    } as Vue.PropOptions<UUID | BaseItem | UUID[] | BaseItem[]>,
    modelUrl: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    propMode: { type: String, default: undefined } as Vue.PropOptions<keyof BaseItem>,
    label: { type: String, default: '' },
    placeholderModel: { type: String, default: '' },
    rules: { type: [String, Object], default: null },
    mode: { type: String, default: 'multiple' },
    bannedSetIds: { type: Array, default: () => [] },
  },
  data: () => ({
    isLoading: false,
    searchedOptions: [] as BaseItem[],
  }),
  computed: {
    SelectType(): typeof SelectType {
      return SelectType
    },
    singleOptionId: {
      get(): BaseItem | undefined {
        if (isEmpty(this.value)) return undefined
        if (this.propMode)
          return this.searchedOptions.find(
            (option) => option[this.propMode] === (this.value as string),
          )
        return (this.value as BaseItem[])?.[0] || this.value
      },
      set(v: BaseItem) {
        this.$emit('input', this.propMode ? v[this.propMode] : v)
      },
    },
    multiOptionsIds: {
      get(): BaseItem[] {
        if (this.propMode)
          return this.searchedOptions.filter((option) =>
            (this.value as string[]).includes(String(option[this.propMode])),
          )
        return this.value as BaseItem[]
      },
      set(v: BaseItem[]) {
        this.$emit('input', this.propMode ? v.map((e) => e[this.propMode]) : v)
      },
    },
    inputValue(): string | AntSelectOption[] | undefined {
      if (this.mode === this.SelectType.Multiple) {
        return this.multiOptionsIds.map((item) => ({
          key: item.id,
          label: item.name || item.code!,
        }))
      } else {
        if (this.singleOptionId)
          return [
            {
              key: this.singleOptionId.id,
              label: this.singleOptionId.name || this.singleOptionId.code!,
            },
          ]
        else return undefined
      }
    },
    options(): BaseItem[] {
      if (this.mode === this.SelectType.Multiple)
        return (
          uniqBy([...this.multiOptionsIds, ...this.searchedOptions], 'id').filter(
            (item) => !this.bannedSetIds.includes(item.id),
          ) || []
        )
      else
        return (
          uniqBy([...this.searchedOptions], 'id').filter(
            (item) => !this.bannedSetIds.includes(item.id),
          ) || []
        )
    },
  },
  mounted() {
    this.fetchItems()
  },
  methods: {
    onSearch: debounce(function (this: any, search: string) {
      this.fetchItems(search)
    }, 500),

    onInput(v: any) {
      if (v === undefined) this.$emit('input', undefined)
      else if (Array.isArray(v) && v.length === 0) this.$emit('input', [])
    },

    onDeselect({ key }: AntSelectOption) {
      if (this.mode === this.SelectType.Multiple)
        this.multiOptionsIds = this.multiOptionsIds.filter(({ id }) => id !== key)
    },

    onSelect(selectedOption: AntSelectOption) {
      if (this.mode === this.SelectType.Multiple) {
        this.multiOptionsIds = [
          ...this.multiOptionsIds,
          this.options.find(({ id }) => id === selectedOption.key)!,
        ]
      } else {
        this.singleOptionId = this.options.find(({ id }) => id === selectedOption.key)
      }
    },

    async fetchItems(query: string = '') {
      this.isLoading = true
      const {
        data: { data: data },
      } = await api.get<{ data: BaseItem[] }>(`/${this.modelUrl}?search=${query}`)

      this.searchedOptions = data

      this.isLoading = false
    },
  },
})
</script>
