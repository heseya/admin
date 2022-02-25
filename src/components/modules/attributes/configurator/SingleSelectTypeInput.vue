<template>
  <div class="single-select-input">
    <app-select
      v-model="selectedOptionId"
      class="single-select-input__select"
      option-filter-prop="label"
      :disabled="disabled"
      show-search
      allow-clear
      :loading="isLoading"
      :placeholder="$t('placeholder')"
      @search="onSearch"
      @inputKeydown="onInputKeydown"
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
import { AttributeOption, ProductAttribute } from '@/interfaces/Attribute'
import { UUID } from '@/interfaces/UUID'
import { formatApiNotificationError } from '@/utils/errors'
import Empty from '@/components/layout/Empty.vue'

type AddOptionResult = { success: true; option: AttributeOption } | { success: false; error: any }

export default Vue.extend({
  components: { Empty },
  props: {
    value: {
      type: Object,
      default: () => undefined,
    } as Vue.PropOptions<AttributeOption | undefined>,
    attribute: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductAttribute>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isLoading: false,
    options: [] as AttributeOption[],
    searchedValue: '',
  }),
  computed: {
    selectedOptionId: {
      get(): UUID | undefined {
        return this.value?.id || undefined
      },
      set(v: UUID | null) {
        const option = this.options.find((o) => o.id === v) || null
        this.$emit('input', option)
      },
    },
  },
  watch: {
    attribute() {
      this.fetchAttribute()
    },
  },
  methods: {
    onInputKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') this.createOption()
    },
    onSearch(value: string) {
      this.searchedValue = value
    },

    async fetchAttribute() {
      const attribute = await this.$accessor.attributes.get(this.attribute.id)
      if (attribute) this.options = [...attribute.options] as AttributeOption[]
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
        this.selectedOptionId = option.id
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
  &__select {
    min-width: 330px;
    margin-bottom: 0;
  }
}
</style>
