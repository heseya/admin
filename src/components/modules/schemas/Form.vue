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

    <SelectSchemaOptions
      v-model="form.options"
      :default-option="defaultOption ?? undefined"
      :disabled="disabled"
      :edited-lang="editedLang"
      :prices="pricesForm"
      @update:prices="pricesForm = $event"
      @set-default="defaultOption = $event"
    />

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
      "created": "Schema has been created.",
      "updated": "Schema has been updated."
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import {
  Schema,
  SchemaCreateDto,
  SchemaUpdateDto,
  PriceMapSchemaPrice,
  SchemaOptionCreateDto,
} from '@heseya/store-core'
import isNil from 'lodash/isNil'

import SelectSchemaOptions from '@/components/modules/schemas/SelectSchemaOptions.vue'
import MetadataForm, { MetadataRef } from '@/components/modules/metadata/Accordion.vue'
import AbsoluteContentLangSwitch from '@/components/lang/AbsoluteContentLangSwitch.vue'
import PublishedLangsForm from '@/components/lang/PublishedLangsForm.vue'

import {
  CLEAR_SCHEMA,
  CLEAR_SCHEMA_OPTION,
  CLEAR_SCHEMA_OPTION_TRANSLATION,
  CLEAR_SCHEMA_TRANSLATION,
} from '@/consts/schemaConsts'
import { formatApiNotificationError } from '@/utils/errors'

import { sdk } from '@/api'

export default defineComponent({
  components: {
    ValidationObserver,
    SelectSchemaOptions,
    MetadataForm,
    AbsoluteContentLangSwitch,
    PublishedLangsForm,
  },
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    editedLang: 'pl',
    form: cloneDeep(CLEAR_SCHEMA) as SchemaCreateDto & SchemaUpdateDto,
    pricesForm: [] as PriceMapSchemaPrice[],
    defaultOption: null as number | null,
    isUsedSchemaModalActive: false,
    usedSchemaName: '',
  }),
  computed: {
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
    defaultOptionId(): string | null {
      return this.defaultOption !== null ? this.form.options[this.defaultOption]?.id ?? null : null
    },
  },
  watch: {
    defaultOption(defaultOption: number | null) {
      if (isNil(defaultOption)) return
      this.form.options = this.form.options.map((v: any) => ({ ...v, default: false }))
      this.form.options[defaultOption].default = true

      // set prices of the default option to 0
      this.pricesForm = this.pricesForm.map((priceEntry) => ({
        ...priceEntry,
        options: priceEntry.options.map((option) => ({
          ...option,
          price: option.id === this.defaultOptionId ? '0' : option.price,
        })),
      }))
    },
    schema: {
      handler(schema: Schema) {
        this.initSchemaForm(schema)
        this.fetchPrices()
      },
      immediate: true,
    },
  },
  methods: {
    setEditedLang(langId: string) {
      this.editedLang = langId
      if (!this.form?.translations?.[langId])
        this.$set(this.form.translations, langId, { ...CLEAR_SCHEMA_TRANSLATION })

      this.form.options.forEach((option: SchemaOptionCreateDto) => {
        if (!option.translations?.[langId])
          this.$set(option.translations, langId, { ...CLEAR_SCHEMA_OPTION_TRANSLATION })
      })
    },

    initSchemaForm(schema: Schema) {
      if (!schema.product_id) {
        throw new Error('[SchemaForm][initSchemaForm] schema.product_id not exist!')
      }

      this.form = schema.id
        ? cloneDeep({
            ...CLEAR_SCHEMA,
            ...schema,
            options: schema.options.map(
              (o): SchemaOptionCreateDto => ({
                ...o,
                items: o.items.map((i) => i.id),
                translations: o.translations || {},
              }),
            ),
          })
        : cloneDeep({
            ...CLEAR_SCHEMA,
            product_id: schema.product_id,
            options: [this.createEmptySchemaOption()],
          })
      this.defaultOption = this.getDefaultOptionIndexFromForm()
      this.setEditedLang(this.$accessor.languages.apiLanguage?.id || '')
    },

    getDefaultOptionIndexFromForm() {
      const index = this.form.options.findIndex((o) => o.default)
      return index >= 0 ? index : null
    },

    createEmptySchemaOption() {
      return cloneDeep({
        ...CLEAR_SCHEMA_OPTION,
      })
    },

    async fetchPrices() {
      if (!this.schema?.id) return
      try {
        this.pricesForm = await sdk.Schemas.getPrices(this.schema.id)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },

    async savePrices() {
      try {
        this.pricesForm = await sdk.Schemas.updatePrices(this.schema.id, this.pricesForm)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
    },

    async submit() {
      this.$accessor.startLoading()
      try {
        let id = ''

        const options = this.form.options.map((opt: any) => ({
          ...opt,
          items: opt.items.map((item: any) => item?.id || item),
        }))

        if (!this.form?.id) {
          const schemaCreateDto = {
            required: this.form.required,
            used_schemas: this.form.used_schemas.map((p) => p),
            product_id: this.form.product_id,
            hidden: this.form.hidden,
            published: this.form.published.map((p) => p),
            options: options.map((option) => {
              return {
                default: option.default,
                items: option.items.map((item: string) => item),
                id: option.id,
                translations: { ...option.translations },
                metadata: option.metadata,
                metadata_private: option.metadata_private,
              }
            }),
            translations: { ...this.form.translations },
          }

          const schema = await this.$accessor.schemas.add(schemaCreateDto)

          if (!schema) throw new Error('Schema not created')

          if (schema && schema.id) {
            this.$toast.success(this.$t('alerts.created') as string)
            id = schema.id
          }
        } else {
          // Metadata can be saved only after product is created
          await this.saveMetadata(this.form.id)

          // Prices can be saved only after product is created
          await this.savePrices()

          const schemaUpdateDto = {
            required: this.form.required,
            used_schemas: this.form.used_schemas.map((p) => p),
            product_id: this.form.product_id,
            hidden: this.form.hidden,
            published: this.form.published.map((p) => p),
            options: options.map((option) => {
              return {
                default: option.default,
                items: option.items.map((item: string) => item),
                id: option.id,
                translations: { ...option.translations },
                metadata: option.metadata,
                metadata_private: option.metadata_private,
              }
            }),
            translations: { ...this.form.translations },
          }

          const updateDto = {
            id: this.form.id,
            item: schemaUpdateDto,
          }

          const success = await this.$accessor.schemas.update(updateDto)
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
