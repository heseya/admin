<template>
  <div v-if="selectedOption[0]" class="input-wrapper">
    <div v-if="type === AttributeType.Date" class="date-input">
      <app-input
        v-model="selectedOption[0].value_date"
        class="date-input__input"
        type="date"
        name="value_date"
      />
    </div>
    <div v-else-if="type === AttributeType.Number" class="number-input">
      <app-input
        :value="getOptionName(selectedOption[0])"
        class="number-input__input"
        name="name"
        :label="$t('displayName').toString()"
        :placeholder="$t('namePlaceholder').toString()"
        @input="setOptionName(selectedOption[0], $event)"
      />
      <app-input
        v-model="selectedOption[0].value_number"
        class="number-input__input"
        type="number"
        name="value_number"
        :label="$t('value').toString()"
        :placeholder="$t('valuePlaceholder').toString()"
      />
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "displayName": "Display name",
    "value": "Numeric value",
    "namePlaceholder": "E.g. 300cm",
    "valuePlaceholder": "E.g. 300"
  },
  "pl": {
    "displayName": "Wyświetlana nazwa",
    "value": "Wartość liczbowa",
    "namePlaceholder": "Np. 300cm",
    "valuePlaceholder": "Np. 300"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { cloneDeep } from 'lodash'
import { AttributeOptionDto, AttributeType, ProductAttribute } from '@heseya/store-core'
import { TranslationsFromDto } from '@/interfaces/Translations'

const EMPTY_OPTION_TRANSLATION: TranslationsFromDto<AttributeOptionDto> = {
  name: '',
}

const EMPTY_OPTION: AttributeOptionDto = {
  value_number: null,
  value_date: null,
  translations: {},
}

export default defineComponent({
  props: {
    type: {
      type: String as PropType<AttributeType.Number | AttributeType.Date>,
      required: true,
    },
    value: {
      type: Array as PropType<AttributeOptionDto[] | undefined[]>,
      default: () => [cloneDeep(EMPTY_OPTION)],
    },
    attribute: {
      type: Object as PropType<ProductAttribute>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
    editedLang: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    selectedOption: {
      get(): AttributeOptionDto[] {
        return (this.value as AttributeOptionDto[]) || [cloneDeep(EMPTY_OPTION)]
      },
      set(option: AttributeOptionDto[]) {
        this.$emit('input', option)
      },
    },

    AttributeType(): typeof AttributeType {
      return AttributeType
    },
  },
  watch: {
    value() {
      this.setDefaultValue()
    },
    selectedOption: {
      handler(options: AttributeOptionDto[]) {
        options.forEach((o) => {
          if (!o.translations[this.editedLang])
            this.$set(o.translations, this.editedLang, { ...EMPTY_OPTION_TRANSLATION })
        })
      },
      deep: true,
    },
  },
  mounted() {
    this.setDefaultValue()
  },
  methods: {
    setDefaultValue() {
      if (!this.value?.[0]) this.selectedOption = [cloneDeep(EMPTY_OPTION)]
    },

    getOptionName(option: AttributeOptionDto): string {
      return option.translations[this.editedLang]?.name || ''
    },
    setOptionName(option: AttributeOptionDto, name: string) {
      this.$set(option.translations, this.editedLang, {
        ...option.translations[this.editedLang],
        name,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.input-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.date-input {
  &__input {
    width: 100%;
    max-width: 380px;
    margin-bottom: 0;
  }
}

.number-input {
  display: flex;
  flex-direction: column;

  @media ($viewport-4) {
    flex-direction: row;
  }

  &__input {
    display: block;
    margin-bottom: 0;
    width: 100%;

    @media ($viewport-4) {
      &:not(:first-child) {
        margin-left: 10px;
      }
    }

    @media ($viewport-6) {
      max-width: 185px;
      margin-top: -20px;
    }
  }
}
</style>
