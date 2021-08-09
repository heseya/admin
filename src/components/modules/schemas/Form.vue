<template>
  <validation-observer v-slot="{ handleSubmit }" class="schema-form">
    <validated-input name="name" rules="required" v-model="form.name" label="Nazwa" />
    <validated-input name="description" v-model="form.description" label="Opis" />
    <div class="flex">
      <validation-provider name="schema-type" rules="id-required" v-slot="{ errors }">
        <vs-select v-model="form.type" label="Typ schematu">
          <vs-option
            v-for="{ value, label } in SchemaTypesOptions"
            :key="value"
            :label="label"
            :value="value"
          >
            {{ label }}
          </vs-option>
          <template #message-danger>{{ errors[0] }}</template>
        </vs-select>
      </validation-provider>

      <validated-input
        v-if="form.type !== SchemaType.MultiplySchema"
        v-model="form.price"
        name="price"
        type="number"
        rules="required|not-negative"
        :label="form.type === SchemaType.Multiply ? 'Cena za sztukę' : 'Dodatkowa cena'"
      />
    </div>
    <div class="flex">
      <SwitchInput v-model="form.hidden">
        <template #title>Ukryty</template>
      </SwitchInput>
      <SwitchInput v-model="form.required">
        <template #title>Wymagany</template>
      </SwitchInput>
    </div>
    <div class="flex" v-if="isKindOfNumeric(form.type) || form.type === SchemaType.String">
      <validated-input
        v-model="form.min"
        default="0"
        name="min"
        type="number"
        :label="isKindOfNumeric(form.type) ? 'Minimalna wartość' : 'Minimalna długość'"
      />
      <validated-input
        v-model="form.max"
        type="number"
        name="max"
        :label="isKindOfNumeric(form.type) ? 'Maksymalna wartość' : 'Maksymalna długość'"
      />
      <validated-input
        v-if="isKindOfNumeric(form.type)"
        v-model="form.step"
        type="number"
        name="step"
        label="Krok"
      />
    </div>
    <validated-input
      v-if="isKindOfNumeric(form.type) || form.type === SchemaType.String"
      v-model="form.default"
      name="default"
      :type="isKindOfNumeric(form.type) ? 'number' : 'text'"
      label="Wartość domyślna"
    />
    <SwitchInput v-if="form.type === SchemaType.Boolean" v-model="form.default">
      <template #title>Wartość domyślna</template>
    </SwitchInput>

    <br />

    <select-schema-options
      v-model="form.options"
      :default-option="defaultOption"
      @setDefault="(v) => (defaultOption = v)"
      v-if="form.type === SchemaType.Select"
    />

    <Zone v-if="form.type === SchemaType.MultiplySchema">
      <div class="used-schema">
        <div>
          <small>Mnożony schemat</small><br />
          <b>{{ usedSchemaName || '-- wybierz --' }}</b>
        </div>
        <vs-button @click="isUsedSchemaModalActive = true">Zmień</vs-button>
      </div>

      <vs-dialog width="800px" not-center v-model="isUsedSchemaModalActive">
        <template #header>
          <h4 class="flex schema-selector-title">Wybierz istniejący schemat</h4>
        </template>
        <modal-form>
          <selector
            @select="selectUsedSchema"
            type="schemas"
            add-text="Wybierz"
            :existing="[form]"
          />
        </modal-form>
      </vs-dialog>
    </Zone>

    <br />

    <Zone title="Opcje zaawansowane" type="danger">
      <validated-input name="pattern" v-model="form.pattern" label="Wyrażenie regularne" />
      <validated-input name="validation" v-model="form.validation" label="Walidacja" />
    </Zone>
    <br />
    <vs-button color="dark" size="large" @click.stop="handleSubmit(submit)"> Zapisz </vs-button>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import SwitchInput from '@/components/form/SwitchInput.vue'
import Zone from '@/components/layout/Zone.vue'
import SelectSchemaOptions from '@/components/modules/schemas/SelectSchemaOptions.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import Selector from '@/components/Selector.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { Schema, SchemaType } from '@/interfaces/Schema'
import { SchemaTypeLabel } from '@/consts/schemaTypeLabels'

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
    ValidatedInput,
  },
  data: () => ({
    form: cloneDeep(CLEAR_FORM),
    defaultOption: 0,
    isUsedSchemaModalActive: false,
    usedSchemaName: '',
    SchemaTypesOptions: Object.values(SchemaType).map((t) => ({
      value: t,
      label: SchemaTypeLabel[t],
    })),
    SchemaType: SchemaType,
  }),
  props: {
    schema: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Schema>,
    currentProductSchemas: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<Schema[]>,
  },
  computed: {
    selectableSchemas(): Schema[] {
      return this.currentProductSchemas.filter(({ id }) => id !== this.form.id)
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
  },
  methods: {
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
        this.$vs.notification({
          color: 'warning',
          title: 'Wybierz mnożony schemat',
        })
        return
      }

      this.$accessor.startLoading()
      let id = null

      this.form.default =
        this.form.type === SchemaType.Select ? this.defaultOption : this.form.default

      const options = this.form.options.map((opt) => ({
        ...opt,
        items: opt.items.map((item) => item.id),
      }))

      if (!this.form?.id) {
        const { id: newID } = await this.$store.dispatch('schemas/add', { ...this.form, options })
        if (newID) {
          this.$vs.notification({
            color: 'success',
            title: 'Schemat został utworzony.',
          })
          id = newID
        }
      } else {
        const success = await this.$store.dispatch('schemas/update', {
          id: this.form.id,
          item: { ...this.form, options },
        })
        if (success) {
          id = this.form.id
          this.$vs.notification({
            color: 'success',
            title: 'Schemat został zaktualizowany.',
          })
        }
      }
      this.$accessor.stopLoading()
      this.$emit('submit', this.$store.getters['schemas/getFromListById'](id))
    },
  },
  created() {
    this.form = this.schema.type ? cloneDeep(this.schema) : cloneDeep(CLEAR_FORM)
    this.defaultOption = Number(this.form.default)
  },
})
</script>

<style lang="scss">
.schema-form {
  .vs-input-parent {
    margin-top: 24px;
    margin-bottom: 0 !important;
  }

  .vs-select-content {
    width: 100%;
    margin-top: 20px;
    max-width: 1000px;
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

  .vs-radio__label {
    font-size: 0.6em;
  }

  .vs-select__label {
    padding-left: 8px;
  }
}
</style>
