<template>
  <ValidationObserver v-slot="{ handleSubmit }" class="sales-channel-form">
    <div class="sales-channel-form__row">
      <validated-input
        v-model="formName"
        :disabled="disabled"
        name="name"
        rules="required"
        :label="$t('common.form.name').toString()"
      />

      <validated-input
        v-model="form.slug"
        :disabled="disabled"
        name="slug"
        rules="required|slug"
        :label="$t('common.form.slug').toString()"
      />
    </div>

    <app-select
      v-model="form.status"
      :label="$t('form.status.title').toString()"
      :disabled="disabled"
    >
      <a-select-option
        v-for="t in SalesChannelStatus"
        :key="t"
        :value="t"
        :label="$t(`form.status.${t}`)"
      >
        {{ $t(`form.status.${t}`) }}
      </a-select-option>
    </app-select>

    <validated-input
      v-model="form.vat_rate"
      :disabled="disabled"
      name="vat_rate"
      rules="required|not-negative|less-or-equal-than:100"
      :label="$t('form.vat_rate').toString()"
    />

    <div class="sales-channel-form__row">
      <validated-select
        v-model="form.default_currency"
        :options="currencies"
        option-key="code"
        :disabled="disabled"
        mode="default"
        :label="$t('form.default_currency').toString()"
        option-filter-prop="name"
        rules="required"
      />

      <AutocompleteInput
        v-model="form.default_language_id"
        mode="default"
        prop-mode="id"
        model-url="languages"
        rules="required"
        :label="$t('form.default_language').toString()"
      />
    </div>

    <br />
    <PublishedLangsForm v-model="form.published" />
    <br />

    <h5>
      {{
        form.countries_block_list
          ? $t('form.deliveryRegionsBlockList')
          : $t('form.deliveryRegionsAllowList')
      }}
    </h5>
    <div class="sales-channel-form__row">
      <CountriesSelect
        v-model="form.countries"
        :disabled="disabled"
        :label="$t('form.countries').toString()"
        :block-list="form.countries_block_list"
      />

      <flex-input class="sales-channel-form__switch">
        <label>{{ $t('common.blockList') }}</label>
        <a-switch v-model="form.countries_block_list" :disabled="disabled" />
      </flex-input>
    </div>

    <br />
    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(onSubmit)">
      {{ $t('common.save') }}
    </app-button>

    <AbsoluteContentLangSwitch
      class="attribute-form__lang-switch"
      :value="editedLang"
      @input="setEditedLang"
    />
  </ValidationObserver>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "deliveryRegionsAllowList": "Wysyłka możliwa wyłącznie do",
      "deliveryRegionsBlockList": "Kraje do których wysyłka będzie zablokowana (pozostałe kraje będą dozwolone)",
      "countries": "Kraje",
      "default_currency": "Domyślna waluta",
      "default_language": "Domyślny język",
      "vat_rate": "Stawka VAT (%)",
      "status": {
        "title": "Status",
        "active": "Aktywny",
        "inactive": "Nieaktywny",
        "hidden": "Ukryty"
      }
    }
  },
  "en": {
    "form": {
      "deliveryRegionsAllowList": "Delivery allowed only to",
      "deliveryRegionsBlockList": "Countries to which delivery will be blocked (other countries will be allowed)",
      "countries": "Countries",
      "default_currency": "Default currency",
      "default_language": "Default language",
      "vat_rate": "VAT rate (%)",
      "status": {
        "title": "Status",
        "active": "Active",
        "inactive": "Inactive",
        "hidden": "Hidden"
      }
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { SalesChannelCreateDto, SalesChannelStatus, Currency } from '@heseya/store-core'

import { TranslationsFromDto } from '@/interfaces/Translations'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'
import FlexInput from '@/components/layout/FlexInput.vue'

import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'
import CountriesSelect from '@/components/CountriesSelect.vue'

const CLEAR_TRANSLATION_FORM: TranslationsFromDto<SalesChannelCreateDto> = {
  name: '',
}

export default defineComponent({
  components: {
    ValidationObserver,
    FlexInput,
    AbsoluteContentLangSwitch,
    AutocompleteInput,
    PublishedLangsForm,
    CountriesSelect,
  },

  props: {
    value: {
      type: Object as PropType<SalesChannelCreateDto>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['submit', 'input'],

  data: () => ({
    editedLang: '',
  }),

  computed: {
    currencies(): Currency[] {
      return this.$accessor.config.currencies
    },

    form: {
      get(): SalesChannelCreateDto {
        return this.value
      },
      set(value: SalesChannelCreateDto) {
        this.$emit('input', value)
      },
    },

    formName: {
      get(): string {
        return this.form.translations[this.editedLang]?.name || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].name = value
      },
    },

    SalesChannelStatus(): typeof SalesChannelStatus {
      return SalesChannelStatus
    },
  },

  watch: {
    form: {
      handler() {
        this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
      },
      immediate: true,
    },
  },

  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId
      if (!this.form.translations[langId])
        this.$set(this.form.translations, langId, { ...CLEAR_TRANSLATION_FORM })
    },

    onSubmit() {
      this.$emit('submit')
    },
  },
})
</script>

<style lang="scss" scoped>
.sales-channel-form {
  &__row {
    display: flex;
    gap: 8px;
    justify-content: stretch;

    & > * {
      flex: 1;
    }
  }

  &__switch {
    text-align: right;
    font-size: 0.8em;
    flex: 0;
  }
}
</style>
