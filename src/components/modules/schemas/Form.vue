<template>
  <validation-observer v-slot="{ handleSubmit }" class="schema-form">
    <validated-input
      v-model="form.name"
      :disabled="disabled"
      name="name"
      rules="required"
      :label="$t('common.form.name')"
    />
    <validated-input
      v-model="form.description"
      :disabled="disabled"
      name="description"
      :label="$t('common.form.description')"
    />
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

      <validated-input
        v-if="form.type !== SchemaType.MultiplySchema"
        v-model="form.price"
        :disabled="disabled"
        name="price"
        type="number"
        rules="required|not-negative"
        :label="
          form.type === SchemaType.Multiply ? $t('form.pricePerUnit') : $t('form.additionalPrice')
        "
      />
    </div>
    <div class="flex">
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

    <select-schema-options
      v-if="form.type === SchemaType.Select"
      v-model="form.options"
      :default-option="defaultOption"
      :disabled="disabled"
      @setDefault="(v) => (defaultOption = v)"
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
        <modal-form>
          <selector
            type="schemas"
            :add-text="$t('choose')"
            :existing="[form]"
            @select="selectUsedSchema"
          />
        </modal-form>
      </a-modal>
    </Zone>

    <br />

    <Zone :title="$t('advancedOptions')" type="danger">
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
    <app-button data-cy="submit-btn" :disabled="disabled" @click.stop="handleSubmit(submit)">
      {{ $t('common.save') }}
    </app-button>
  </validation-observer>
</template>

<i18n>
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
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import SwitchInput from '@/components/form/SwitchInput.vue'
import Zone from '@/components/layout/Zone.vue'
import SelectSchemaOptions from '@/components/modules/schemas/SelectSchemaOptions.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import Selector from '@/components/Selector.vue'

import { Schema, SchemaType } from '@/interfaces/Schema'

import { CLEAR_FORM, CLEAR_OPTION } from '@/consts/schemaConsts'

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
    SwitchInput,
    Zone,
    SelectSchemaOptions,
    ModalForm,
    Selector,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Schema>,
    currentProductSchemas: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<Schema[]>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    form: cloneDeep(CLEAR_FORM),
    defaultOption: 0,
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
  },
  watch: {
    defaultOption(defaultOption: number) {
      if (this.form.type === SchemaType.Select) {
        this.form.options = this.form.options.map((v) => ({ ...v, default: false }))
        this.form.options[defaultOption].default = true
      }
    },
    'form.type'(type: SchemaType) {
      if (type === SchemaType.Select) this.form.options = [cloneDeep(CLEAR_OPTION)]
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
    initSchemaForm(schema: Schema) {
      this.form = schema.type ? cloneDeep(schema) : cloneDeep(CLEAR_FORM)
      this.defaultOption = Number(this.form.default)
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
          this.form.type === SchemaType.Select ? this.defaultOption : this.form.default

        const options = this.form.options.map((opt) => ({
          ...opt,
          items: opt.items.map((item) => item.id),
        }))

        if (!this.form?.id) {
          // @ts-ignore // TODO: Schema DTO
          const schema = await this.$accessor.schemas.add({ ...this.form, options })
          if (!schema) throw new Error('Schema not created')

          if (schema && schema.id) {
            this.$toast.success(this.$t('alerts.created') as string)
            id = schema.id
          }
        } else {
          const success = await this.$accessor.schemas.update({
            id: this.form.id,
            // @ts-ignore // TODO: Schema DTO
            item: { ...this.form, options },
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
  },
})
</script>

<style lang="scss">
.schema-form {
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
}
</style>
