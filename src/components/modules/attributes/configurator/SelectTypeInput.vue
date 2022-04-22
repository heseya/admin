<template>
  <div class="single-select-input">
    <app-select
      :value="inputValue"
      class="single-select-input__select"
      option-filter-prop="label"
      :mode="isMutipleMode ? 'multiple' : 'default'"
      :disabled="disabled || isLoading"
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

<i18n>
{
  "en": {
    "placeholder": "Select or create an option",
    "createOption": "Create new option",
    "empty": "Start typing to create a new option"
  },
  "pl": {
    "placeholder": "Wybierz lub utwórz opcję",
    "createOption": "Utwórz nową opcję",
    "empty": "Zacznij pisać, aby utworzyć nową opcje"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
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

    multiOptionsIds(): UUID[] {
      return (this.value || []).map((v) => v?.id).filter(Boolean) || []
    },

    inputValue(): UUID | UUID[] | undefined {
      if (this.isLoading) return this.isMutipleMode ? [] : undefined
      return this.isMutipleMode ? this.multiOptionsIds : this.singleOptionId
    },
  },
  watch: {
    attribute() {
      this.fetchAttribute()
    },
  },
  mounted() {
    this.fetchAttribute()
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
    },

    async fetchAttribute() {
      this.isLoading = true
      const attribute = await this.$accessor.attributes.get(this.attribute.id)
      if (attribute) this.options = [...attribute.options] as AttributeOption[]
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