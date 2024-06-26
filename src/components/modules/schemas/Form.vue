<template>
  <validation-observer v-slot="{ handleSubmit }" class="schema-form">
    <validated-input
      v-model="formName"
      :disabled="disabled"
      name="name"
      rules="required"
      :label="$t('common.form.name')"
    />
    <validated-input
      v-model="formDescription"
      :disabled="disabled"
      name="description"
      :label="$t('common.form.description')"
    />

    <br />
    <PublishedLangsForm v-model="form.published" />
    <br />

    <div class="flex">
      <validation-provider v-slot="{ errors }" name="schema-type" rules="id-required">
        <app-select
          v-model="form.type"
          :disabled="disabled"
          name="type"
          :label="$t('form.type')"
          option-filter-prop="label"
        >
          <a-select-option
            v-for="{ value, label } in SchemaTypesOptions"
            :key="value"
            :label="label"
          >
            {{ label }}
          </a-select-option>
          <template #message-danger>{{ errors[0] }}</template>
        </app-select>
      </validation-provider>

      <CurrencyPriceForm
        v-if="form.type !== SchemaType.MultiplySchema"
        v-model="form.prices"
        :disabled="disabled"
        :label="
          form.type === SchemaType.Multiply
            ? $t('form.pricePerUnit').toString()
            : $t('form.additionalPrice').toString()
        "
      />
    </div>
    <div class="flex switches">
      <ValidatedSwitchInput
        v-model="form.hidden"
        :disabled="disabled"
        name="hidden"
        rules="schema-checkbox:@disabled"
      >
        <template #title>{{ $t('form.hidden') }}</template>
      </ValidatedSwitchInput>
      <ValidatedSwitchInput
        v-model="form.required"
        :disabled="disabled"
        name="disabled"
        rules="schema-checkbox:@hidden"
      >
        <template #title>{{ $t('form.required') }}</template>
      </ValidatedSwitchInput>
    </div>
    <div v-if="isKindOfNumeric(form.type) || form.type === SchemaType.String" class="flex">
      <validated-input
        v-model="form.min"
        :disabled="disabled"
        default="0"
        name="min"
        type="number"
        :label="isKindOfNumeric(form.type) ? $t('form.minValue') : $t('form.minLength')"
      />
      <validated-input
        v-model="form.max"
        :disabled="disabled"
        type="number"
        name="max"
        :label="isKindOfNumeric(form.type) ? $t('form.maxValue') : $t('form.maxLength')"
      />
      <validated-input
        v-if="isKindOfNumeric(form.type)"
        v-model="form.step"
        :disabled="disabled"
        type="number"
        name="step"
        :label="$t('form.step')"
      />
    </div>
    <validated-input
      v-if="isKindOfNumeric(form.type) || form.type === SchemaType.String"
      v-model="form.default"
      :disabled="disabled"
      name="default"
      :type="isKindOfNumeric(form.type) ? 'number' : 'text'"
      :label="$t('form.default')"
    />
    <SwitchInput
      v-if="form.type === SchemaType.Boolean"
      v-model="form.default"
      :disabled="disabled"
    >
      <template #title>{{ $t('form.default') }}</template>
    </SwitchInput>

    <br />

    <SelectSchemaOptions
      v-if="form.type === SchemaType.Select"
      v-model="form.options"
      :default-option="defaultOption || undefined"
      :disabled="disabled"
      :edited-lang="editedLang"
      @set-default="(v) => (defaultOption = v)"
    />

    <Zone v-if="form.type === SchemaType.MultiplySchema">
      <div class="used-schema">
        <div>
          <small>{{ $t('multipliedSchema') }}</small
          ><br />
          <b>{{ usedSchemaName || $t('choosePlaceholder') }}</b>
        </div>
        <app-button @click="isUsedSchemaModalActive = true">{{ $t('change') }}</app-button>
      </div>

      <a-modal
        v-model="isUsedSchemaModalActive"
        width="800px"
        :title="$t('modalTitle')"
        :footer="null"
      >
        <modal-form v-if="isUsedSchemaModalActive">
          <selector
            type="schemas"
            :add-text="$t('choose').toString()"
            :existing="[form]"
            @select="selectUsedSchema"
          />
        </modal-form>
      </a-modal>
    </Zone>

    <br />

    <Zone :title="$t('advancedOptions').toString()" type="danger">
      <validated-input
        v-model="form.pattern"
        :disabled="disabled"
        name="pattern"
        :label="$t('form.pattern')"
      />
      <validated-input
        v-model="form.validation"
        :disabled="disabled"
        name="validation"
        :label="$t('form.validation')"
      />
    </Zone>

    <br />

    <template v-if="form.id">
      <MetadataForm
        ref="publicMeta"
        :value="schema.metadata"
        :disabled="disabled"
        model="schemas"
      />
      <MetadataForm
        v-if="schema.metadata_private"
        ref="privateMeta"
        :value="schema.metadata_private"
        :disabled="disabled"
        type="private"
        model="schemas"
      />
    </template>

    <br />
    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(submit)">
      {{ $t('common.save') }}
    </app-button>

    <AbsoluteContentLangSwitch
      class="schema-form__lang-switch"
      :value="editedLang"
      @input="setEditedLang"
    />
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "type": "Typ schematu",
      "pricePerUnit": "Cena za sztukę",
      "additionalPrice": "Dodatkowa cena",
      "hidden": "Ukryty",
      "required": "Wymagany",
      "minValue": "Minimalna wartość",
      "minLength": "Minimalna długość",
      "maxValue": "Maksymalna wartość",
      "maxLength": "Maksymalna długość",
      "step": "Krok",
      "default": "Wartość domyślna",
      "pattern": "Wyrażenie regularne",
      "validation": "Walidacja"
    },
    "advancedOptions": "Opcje zaawansowane",
    "multipliedSchema": "Mnożony schemat",
    "modalTitle": "Wybierz istniejący schemat",
    "choose": "Wybierz",
    "choosePlaceholder": "-- wybierz --",
    "change": "Zmień",
    "alerts": {
      "selectMultiplied": "Wybierz mnożony schemat",
      "created": "Schemat został utworzony.",
      "updated": "Schemat został zaktualizowany."
    }
  },
  "en": {
    "form": {
      "type": "Schema type",
      "pricePerUnit": "Price per unit",
      "additionalPrice": "Additional price",
      "hidden": "Hidden",
      "required": "Required",
      "minValue": "Minimal value",
      "minLength": "Minimal length",
      "maxValue": "Maximal value",
      "maxLength": "Maximal length",
      "step": "Step",
      "default": "Default value",
      "pattern": "Regular expression",
      "validation": "Validation"
    },
    "advancedOptions": "Advanced options",
    "multipliedSchema": "Multiplied schema",
    "modalTitle": "Choose existing schema",
    "choose": "Choose",
    "choosePlaceholder": "-- choose --",
    "change": "Change",
    "alerts": {
      "selectMultiplied": "Select multiplied schema",
      "created": "Schema has been created.",
      "updated": "Schema has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { SchemaType, Schema, SchemaOptionDto, SchemaCreateDto } from '@heseya/store-core'
import isNil from 'lodash/isNil'

import SwitchInput from '@/components/form/SwitchInput.vue'
import Zone from '@/components/layout/Zone.vue'
import SelectSchemaOptions from '@/components/modules/schemas/SelectSchemaOptions.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import Selector from '@/components/Selector.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'
import CurrencyPriceForm from '@/components/CurrencyPriceForm.vue'

import {
  CLEAR_SCHEMA,
  CLEAR_SCHEMA_OPTION,
  CLEAR_SCHEMA_OPTION_TRANSLATION,
  CLEAR_SCHEMA_TRANSLATION,
} from '@/consts/schemaConsts'
import { mapPricesToDto } from '@/utils/currency'

export default defineComponent({
  components: {
    ValidationProvider,
    ValidationObserver,
    SwitchInput,
    Zone,
    SelectSchemaOptions,
    ModalForm,
    Selector,
    MetadataForm,
    AbsoluteContentLangSwitch,
    PublishedLangsForm,
    CurrencyPriceForm,
  },
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    currentProductSchemas: {
      type: Array as PropType<Schema[]>,
      default: () => [],
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    editedLang: 'pl',
    form: cloneDeep(CLEAR_SCHEMA) as SchemaCreateDto & { id?: string },
    defaultOption: null as number | null,
    isUsedSchemaModalActive: false,
    usedSchemaName: '',
    SchemaType: SchemaType,
  }),
  computed: {
    selectableSchemas(): Schema[] {
      return this.currentProductSchemas.filter(({ id }) => id !== this.form.id)
    },
    SchemaTypesOptions(): { value: string; label: string }[] {
      return Object.values(SchemaType).map((t) => ({
        value: t,
        label: this.$t(`schemaTypes.${t}`) as string,
      }))
    },

    formDescription: {
      get(): string {
        return this.form.translations[this.editedLang]?.description || ''
      },
      set(value: string) {
        this.form.translations[this.editedLang].description = value
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
  },
  watch: {
    defaultOption(defaultOption: number | null) {
      if (isNil(defaultOption)) return
      if (this.form.type === SchemaType.Select) {
        this.form.options = this.form.options.map((v: any) => ({ ...v, default: false }))
        // TODO: fix typing, in this component actually default is a custom field in SchemaOptionDto
        this.form.options[defaultOption].default = true
      }
    },
    'form.type'(type: SchemaType) {
      if (type === SchemaType.Select) this.form.options = [this.createEmptySchemaOption()]
      else this.form.options = []
    },
    'form.used_schemas.0'(schema: Schema) {
      // ! This is buggy, and somehow works only on init
      const newName =
        [...this.currentProductSchemas, ...this.$store.state.schemas.data].find(
          ({ id }) => id === schema,
        )?.name || schema
      this.usedSchemaName = newName
    },
    schema(schema) {
      this.initSchemaForm(schema)
    },
  },
  created() {
    this.initSchemaForm(this.schema)
  },
  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId
      if (!this.form?.translations?.[langId])
        this.$set(this.form.translations, langId, { ...CLEAR_SCHEMA_TRANSLATION })

      this.form.options.forEach((option: SchemaOptionDto) => {
        if (!option.translations?.[langId])
          this.$set(option.translations, langId, { ...CLEAR_SCHEMA_OPTION_TRANSLATION })
      })
    },
    initSchemaForm(schema: Schema) {
      this.form = schema.type
        ? cloneDeep({
            ...schema,
            prices: mapPricesToDto(schema.prices),
            options: schema.options.map((o) => ({ ...o, prices: mapPricesToDto(o.prices) })),
          })
        : cloneDeep({
            ...CLEAR_SCHEMA,
            prices: this.$accessor.config.currencies.map((c) => ({ value: '0', currency: c.code })),
            options: [this.createEmptySchemaOption()],
          })
      this.defaultOption = isNil(this.form.default) ? null : Number(this.form.default)
      this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
    },

    createEmptySchemaOption() {
      return cloneDeep({
        ...CLEAR_SCHEMA_OPTION,
        prices: this.$accessor.config.currencies.map((c) => ({ value: '0', currency: c.code })),
      })
    },

    isKindOfNumeric(type: SchemaType): boolean {
      return (
        type === SchemaType.Numeric ||
        type === SchemaType.Multiply ||
        type === SchemaType.MultiplySchema
      )
    },
    selectUsedSchema(schema: Schema) {
      this.form.used_schemas[0] = schema.id
      this.usedSchemaName = schema.name
      this.isUsedSchemaModalActive = false
    },
    async submit() {
      if (this.form.type === SchemaType.MultiplySchema && !this.form.used_schemas[0]) {
        this.$toast.warning(this.$t('alerts.selectMultiplied') as string)
        return
      }

      this.$accessor.startLoading()
      try {
        let id = ''

        this.form.default =
          this.form.type === SchemaType.Select ? this.defaultOption?.toString() : this.form.default

        const options = this.form.options.map((opt: any) => ({
          ...opt,
          items: opt.items.map((item: any) => item.id),
        }))

        if (!this.form?.id) {
          const schema = await this.$accessor.schemas.add({ ...this.form, options })
          if (!schema) throw new Error('Schema not created')

          if (schema && schema.id) {
            this.$toast.success(this.$t('alerts.created') as string)
            id = schema.id
          }
        } else {
          // Metadata can be saved only after product is created
          await this.saveMetadata(this.form.id)

          const success = await this.$accessor.schemas.update({
            id: this.form.id,
            item: { ...this.form, options, metadata: undefined, metadata_private: undefined },
          })
          if (!success) throw new Error('Schema not updated')

          id = this.form.id
          this.$toast.success(this.$t('alerts.updated') as string)
        }
        this.$emit('submit', this.$accessor.schemas.getFromListById(id))
      } catch {
      } finally {
        this.$accessor.stopLoading()
      }
    },

    async saveMetadata(id: string) {
      await Promise.all([
        (this.$refs.privateMeta as MetadataRef)?.saveMetadata(id),
        (this.$refs.publicMeta as MetadataRef)?.saveMetadata(id),
      ])
    },
  },
})
</script>

<style lang="scss">
.schema-form {
  position: relative;

  &__lang-switch {
    left: calc(100% + 12px);

    .content-lang-switch {
      background-color: #fff;
    }
  }

  .flex {
    display: flex;

    > * {
      width: 100%;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .used-schema {
    display: flex;
    justify-content: space-between;
  }

  .switch-input {
    display: grid;
    grid-auto-flow: column;
    column-gap: 8px;
  }

  .switches {
    margin: 8px 0;
  }
}
</style>
