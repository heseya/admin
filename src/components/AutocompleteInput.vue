<template>
  <div class="autocomplete-input">
    <ValidationProvider ref="provider" v-slot="{ errors }" :rules="rules">
      <app-select
        ref="select"
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
        :filter-option="false"
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
import { ComponentPublicInstance, defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import isEmpty from 'lodash/isEmpty'
import { ValidationProvider } from 'vee-validate'

import { api } from '@/api'
import Empty from '@/components/layout/Empty.vue'
import { UUID } from '@/interfaces/UUID'
import { SelectType } from '@/enums/select'
import { stringifyQueryParams } from '@/utils/stringifyQuery'

export interface AutocompleteBaseItem {
  id: UUID
  name?: string
  slug?: string
  code?: string
}

type AntSelectOption = { key: string; label: string }

export default defineComponent({
  components: { Empty, ValidationProvider },
  props: {
    value: {
      type: [String, Object, Array] as PropType<
        UUID | AutocompleteBaseItem | UUID[] | AutocompleteBaseItem[]
      >,
      default: () => [],
    },
    modelUrl: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    propMode: {
      type: String as PropType<keyof AutocompleteBaseItem>,
      default: undefined,
    },
    label: { type: String, default: '' },
    limit: { type: [Number, String], default: 24 },
    placeholderModel: { type: String, default: '' },
    rules: { type: [String, Object], default: null },
    mode: { type: String, default: 'multiple' },
    bannedSetIds: { type: Array, default: () => [] },
  },
  data: () => ({
    observer: null as IntersectionObserver | null,
    isLoading: false,
    isInitiallyFetched: false,
    searchedOptions: [] as AutocompleteBaseItem[],
  }),
  computed: {
    SelectType(): typeof SelectType {
      return SelectType
    },
    singleOptionId: {
      get(): AutocompleteBaseItem | undefined {
        if (isEmpty(this.value)) return undefined
        if (this.propMode)
          return this.searchedOptions.find(
            (option) => option[this.propMode] === (this.value as string),
          )
        return (this.value as AutocompleteBaseItem[])?.[0] || this.value
      },
      set(v: AutocompleteBaseItem) {
        this.$emit('input', this.propMode ? v[this.propMode] : v)
      },
    },
    multiOptionsIds: {
      get(): AutocompleteBaseItem[] {
        if (this.propMode)
          return this.searchedOptions.filter((option) =>
            (this.value as string[]).includes(String(option[this.propMode])),
          )
        return this.value as AutocompleteBaseItem[]
      },
      set(v: AutocompleteBaseItem[]) {
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
    options(): AutocompleteBaseItem[] {
      if (this.mode === this.SelectType.Multiple)
        return (
          uniqBy([...this.multiOptionsIds, ...this.searchedOptions], this.propMode || 'id').filter(
            (item) => !this.bannedSetIds.includes(item.id),
          ) || []
        )
      else
        return (
          uniqBy([...this.searchedOptions], this.propMode || 'id').filter(
            (item) => !this.bannedSetIds.includes(item.id),
          ) || []
        )
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting

        if (isVisible && !this.isInitiallyFetched) {
          this.fetchItems()
        }
      },
      {
        rootMargin: '0px',
        threshold: 1,
      },
    )

    this.observer.observe((this.$refs.select as ComponentPublicInstance)?.$el)
  },
  destroyed() {
    this.observer?.disconnect()
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

    async fetchItems(search: string = '') {
      this.isLoading = true
      const query = stringifyQueryParams({ search, limit: this.limit, lang_fallback: 'any' })
      const {
        data: { data: data },
      } = await api.get<{ data: AutocompleteBaseItem[] }>(`/${this.modelUrl}${query}`)

      this.searchedOptions = data
      this.isInitiallyFetched = true
      this.isLoading = false
    },
  },
})
</script>
