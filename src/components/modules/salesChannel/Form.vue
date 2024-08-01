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

      <SwitchInput
        v-model="form.default"
        :label="$t('form.default').toString()"
        horizontal
        class="sale-status__input"
        name="default"
      />
    </div>

    <div class="sales-channel-form__row">
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
      <app-select
        v-model="form.activity"
        :label="$t('form.activity.title').toString()"
        :disabled="disabled"
      >
        <a-select-option
          v-for="t in SalesChannelActivity"
          :key="t"
          :value="t"
          :label="$t(`form.activity.${t}`)"
        >
          {{ $t(`form.activity.${t}`) }}
        </a-select-option>
      </app-select>
    </div>

    <div class="sales-channel-form__row">
      <AutocompleteInput
        v-model="form.price_map_id"
        mode="default"
        prop-mode="id"
        model-url="price-maps"
        rules="required"
        :label="$t('form.price_map').toString()"
      />

      <validated-input
        v-model="form.vat_rate"
        :disabled="disabled"
        name="vat_rate"
        rules="required|not-negative|less-or-equal-than:100"
        :label="$t('form.vat_rate').toString()"
      />
    </div>

    <div class="sales-channel-form__row">
      <AutocompleteInput
        v-model="form.shipping_method_ids"
        mode="multiple"
        prop-mode="id"
        model-url="shipping-methods"
        rules="required"
        :label="$t('form.shipping_methods').toString()"
      />
      <AutocompleteInput
        v-model="form.payment_method_ids"
        mode="multiple"
        prop-mode="id"
        model-url="payment-methods"
        rules="required"
        :label="$t('form.payment_methods').toString()"
      />
    </div>

    <AutocompleteInput
      v-model="form.language_id"
      mode="default"
      prop-mode="id"
      model-url="languages"
      rules="required"
      :label="$t('form.language').toString()"
    />

    <br />
    <PublishedLangsForm v-model="form.published" />
    <br />

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
      "vat_rate": "Stawka VAT (%)",
      "status": {
        "title": "Status",
        "public": "Publiczny",
        "private": "Prywatny"
      },
      "activity": {
        "title": "Aktywność",
        "active": "Aktywny",
        "inactive": "Nieaktywny"
      },
      "language": "Język",
      "default": "Domyślny kanał",
      "price_map": "Mapa cen",
      "shipping_methods": "Metody dostawy",
      "payment_methods": "Metody płatności"
    }
  },
  "en": {
    "form": {
      "vat_rate": "VAT rate (%)",
      "status": {
        "title": "Status",
        "active": "Active",
        "inactive": "Inactive",
        "hidden": "Hidden"
      },
      "language": "Language",
      "default": "Default channel",
      "price_map": "Price map",
      "shipping_methods": "Shipping methods",
      "payment_methods": "Payment methods"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import {
  SalesChannelCreateDto,
  SalesChannelStatus,
  SalesChannelActivity,
  Currency,
} from '@heseya/store-core'

import { TranslationsFromDto } from '@/interfaces/Translations'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'

import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'

const CLEAR_TRANSLATION_FORM: TranslationsFromDto<SalesChannelCreateDto> = {
  name: '',
}

export default defineComponent({
  components: {
    ValidationObserver,
    AbsoluteContentLangSwitch,
    AutocompleteInput,
    PublishedLangsForm,
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
    SalesChannelActivity(): typeof SalesChannelActivity {
      return SalesChannelActivity
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
