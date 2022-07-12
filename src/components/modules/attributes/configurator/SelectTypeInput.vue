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
      :placeholder="$t('placeholder')"
      @search="onSearch"
      @inputKeydown="onInputKeydown"
      @change="setValue"
    >
      <a-select-option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        :label="option.name"
      >
        {{ option.name }}
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
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "placeholder": "Select or create an option",
    "createOption": "Create new option",
    "empty": "Start typing to create a new option",
    "optionsFetchError": "Error fetching options"
  },
  "pl": {
    "placeholder": "Wybierz lub utwórz opcję",
    "createOption": "Utwórz nową opcję",
    "empty": "Zacznij pisać, aby utworzyć nową opcje",
    "optionsFetchError": "Błąd pobierania opcji"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash/debounce'

import { AttributeOption, AttributeType, ProductAttribute } from '@/interfaces/Attribute'
import { UUID } from '@/interfaces/UUID'
import { formatApiNotificationError } from '@/utils/errors'
import Empty from '@/components/layout/Empty.vue'

type AddOptionResult = { success: true; option: AttributeOption } | { success: false; error: any }

export default Vue.extend({
  components: { Empty },
  props: {
    value: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<AttributeOption[]>,
    attribute: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductAttribute>,
    type: {
      type: String,
      required: true,
    } as Vue.PropOptions<AttributeType>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isLoading: false,
    options: [] as AttributeOption[],
    searchedValue: '',
  }),
  computed: {
    isMutipleMode(): boolean {
      return this.type === AttributeType.MultiChoiceOption
    },

    singleOptionId(): UUID | undefined {
      return this.value?.[0]?.id || undefined
    },

    singleOptionName(): UUID | undefined {
      return this.value?.[0]?.name || undefined
    },

    multiOptionsIds(): UUID[] {
      return (this.value || []).map((v) => v?.id).filter(Boolean) || []
    },

    multiOptionsNames(): UUID[] {
      return (this.value || []).map((v) => v?.name).filter(Boolean) || []
    },

    inputValue(): UUID | UUID[] | undefined {
      return this.isMutipleMode ? this.multiOptionsNames : this.singleOptionName
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
    setValue(v: UUID | UUID[] | undefined) {
      if (this.isMutipleMode) {
        const options = this.options.filter((o) => (v as UUID[])?.includes(o.id))
        this.$emit('input', options)
      } else {
        const option = this.options.find((o) => o.id === (v as UUID | undefined)) || null
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
      // @ts-ignore // TODO: fix extended store actions typings
      const options = await this.$accessor.attributes.getOptions({
        attributeId: this.attribute.id,
        params: { search: this.searchedValue },
      })

      if (!options) {
        this.$toast.error(this.$t('optionsFetchError') as string)
        this.isLoading = false
        return
      }

      this.options = options
      this.isLoading = false
    },

    async createOption() {
      this.isLoading = true
      // @ts-ignore // TODO: fix extended store actions typings
      const result: AddOptionResult = await this.$accessor.attributes.addOption({
        attributeId: this.attribute.id,
        option: {
          name: this.searchedValue,
          value_number: null,
          value_date: null,
        },
      })

      if (result.success) {
        const option = result.option
        this.options = [...this.options, option]

        this.setValue(this.isMutipleMode ? [...this.multiOptionsIds, option.id] : option.id)

        this.searchedValue = ''
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
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
}
</style>
