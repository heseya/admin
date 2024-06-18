<template>
  <div class="single-select-input">
    <app-select
      :value="inputValue"
      class="single-select-input__select"
      option-filter-prop="label"
      :mode="isMutipleMode ? 'multiple' : 'default'"
      :disabled="disabled"
      show-search
      allow-clear
      :loading="isLoading"
      :placeholder="$t('placeholder').toString()"
      :name="`${attribute.id}_value`"
      @search="onSearch"
      @input-keydown="onInputKeydown"
      @change="setValue"
    >
      <a-select-option
        v-for="option in visibleOptions"
        :key="option.id"
        :value="option.id"
        :label="option.name"
      >
        {{ getOptionName(option) }}
        <button
          class="single-select-input__edit-btn"
          :title="$t('editOption').toString()"
          @click.prevent.stop="startOptionEdit(option)"
        >
          <i class="bx bx-pencil"></i>
        </button>
      </a-select-option>

      <template #notFoundContent>
        <app-button
          v-if="searchedValue"
          :loading="isLoading"
          type="success"
          size="small"
          @click="createOption"
        >
          {{ $t('createOption') }}
        </app-button>
        <empty v-else> {{ $t('empty') }} </empty>
      </template>
    </app-select>

    <OptionsEditForm
      v-if="editedOption"
      v-model="editedOption"
      :attribute-id="attribute.id"
      :type="attribute.type"
      :disabled="disabled"
      @update="updateAttributeOption"
    />
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "placeholder": "Select or create an option",
    "createOption": "Create new option",
    "empty": "Start typing to create a new option",
    "editOption": "Edit option, including other languages",
    "optionsFetchError": "Error fetching options"
  },
  "pl": {
    "placeholder": "Wybierz lub utwórz opcję",
    "createOption": "Utwórz nową opcję",
    "empty": "Zacznij pisać, aby utworzyć nową opcje",
    "editOption": "Edytuj opcję, w tym inne języki",
    "optionsFetchError": "Błąd pobierania opcji"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import {
  AttributeOption,
  AttributeOptionDto,
  AttributeType,
  ProductAttribute,
} from '@heseya/store-core'

import Empty from '@/components/layout/Empty.vue'
import { UUID } from '@/interfaces/UUID'
import { ApiError, formatApiNotificationError } from '@/utils/errors'
import { uniqueArray } from '@/utils/uniqueArray'
import OptionsEditForm from '../OptionsEditForm.vue'

export default defineComponent({
  components: { Empty, OptionsEditForm },
  props: {
    editedLang: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<AttributeOption[]>,
      default: () => [],
    },
    attribute: {
      type: Object as PropType<ProductAttribute>,
      required: true,
    },
    type: {
      type: String as PropType<AttributeType>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isLoading: false,
    visibleOptions: [] as AttributeOption[],
    allOptions: [] as AttributeOption[],
    searchedValue: '',
    editedOption: null as AttributeOptionDto | null,
  }),
  computed: {
    isMutipleMode(): boolean {
      return this.type === AttributeType.MultiChoiceOption
    },

    singleOptionId(): UUID | undefined {
      return this.value?.[0]?.id || undefined
    },

    multiOptionsIds(): UUID[] {
      return (this.value || []).map((v) => v?.id).filter(Boolean) || []
    },

    inputValue(): UUID | UUID[] | undefined {
      return this.isMutipleMode ? this.multiOptionsIds : this.singleOptionId
    },
  },
  watch: {
    attribute() {
      this.fetchOptions()
    },
  },
  mounted() {
    this.fetchOptions()
  },
  methods: {
    startOptionEdit(option: AttributeOption) {
      this.editedOption = {
        ...cloneDeep(option),
        translations: cloneDeep(option.translations || {}),
      }
    },

    updateAttributeOption(option: AttributeOption) {
      this.allOptions = this.allOptions.map((o) => (o.id === option.id ? option : o))
      this.visibleOptions = this.visibleOptions.map((o) => (o.id === option.id ? option : o))
      this.editedOption = null
    },

    getOptionName(option: AttributeOption): string {
      return option.translations?.[this.editedLang]?.name ?? option.name
    },

    setValue(v: UUID | UUID[] | undefined) {
      if (this.isMutipleMode) {
        const options = this.allOptions.filter((o) => (v as UUID[])?.includes(o.id))
        this.$emit('input', options)
      } else {
        const option = this.allOptions.find((o) => o.id === (v as UUID | undefined)) || null
        this.$emit('input', [option])
      }
    },
    onInputKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') this.createOption()
    },
    onSearch(value: string) {
      this.searchedValue = value
      this.debouncedFetchOptions()
    },

    debouncedFetchOptions: debounce(function (this: any) {
      this.fetchOptions()
    }, 300),

    async fetchOptions() {
      this.isLoading = true
      const searchedOptions =
        (await this.$accessor.attributes.getOptions({
          attributeId: this.attribute.id,
          params: { search: this.searchedValue },
        })) || []

      if (!this.visibleOptions) {
        this.$toast.error(this.$t('optionsFetchError') as string)
        this.isLoading = false
        return
      }

      if (this.value.some(Boolean)) {
        const choosenOptions = (
          await Promise.all(
            this.value.map(({ id }) =>
              this.$accessor.attributes.getOptions({
                attributeId: this.attribute.id,
                params: { search: id },
              }),
            ),
          )
        ).filter(Boolean) as AttributeOption[][]

        this.allOptions = uniqueArray([
          ...this.allOptions,
          ...searchedOptions,
          ...choosenOptions.flat(),
        ])
        // #notFoundContent slot is shown only when options array is empty.
        // So we need to clear it when API does not return any data from main query
        this.visibleOptions = searchedOptions.length ? [...this.allOptions] : []
        this.isLoading = false

        return
      }

      this.visibleOptions = searchedOptions
      this.allOptions = uniqueArray([...this.allOptions, ...searchedOptions])
      this.isLoading = false
    },

    async createOption() {
      this.isLoading = true

      const result = await this.$accessor.attributes.addOption({
        attributeId: this.attribute.id,
        option: {
          translations: {
            [this.editedLang]: {
              name: this.searchedValue,
            },
          },
          value_number: null,
          value_date: null,
        },
      })

      if (result.success) {
        const option = result.option
        this.visibleOptions = [...this.visibleOptions, option]
        this.allOptions = [...this.allOptions, option]

        this.setValue(this.isMutipleMode ? [...this.multiOptionsIds, option.id] : option.id)

        this.searchedValue = ''
      } else {
        this.$toast.error(formatApiNotificationError(result.error as ApiError))
      }

      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.single-select-input {
  width: 100%;

  &__select {
    margin-left: auto;
    width: 100%;
    max-width: 380px;
    margin-bottom: 0;
  }

  &__edit-btn {
    all: unset;
    cursor: pointer;
    border: solid 1px $gray-color-400;
    border-radius: 4px;
    padding: 2px;
    font-size: 0.8em;
    display: inline-flex;
    transition: 0.3s;

    &:hover {
      border-color: $primary-color-500;
    }
  }
}
</style>
