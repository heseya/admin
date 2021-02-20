<template>
  <validation-observer v-slot="{ handleSubmit }" class="schema-form">
    <validation-provider rules="required" v-slot="{ errors }">
      <vs-input v-model="form.name" label="Nazwa">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <validation-provider rules="required" v-slot="{ errors }">
      <vs-input v-model="form.description" label="Opis">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <div class="flex">
      <validation-provider rules="id-required" v-slot="{ errors }">
        <vs-select v-model="form.type" filter label="Typ schematu">
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
      <validation-provider rules="required|not-negative" v-slot="{ errors }">
        <vs-input v-model="form.price" label="Dodatkowa cena">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
    </div>
    <div class="flex">
      <SwitchInput>
        <template #title>Ukryty</template>
        <vs-switch success v-model="form.hidden">
          <template #off>
            <i class="bx bx-x"></i>
          </template>
          <template #on>
            <i class="bx bx-check"></i>
          </template>
        </vs-switch>
      </SwitchInput>
      <SwitchInput>
        <template #title>Wymagany</template>
        <vs-switch success v-model="form.required">
          <template #off>
            <i class="bx bx-x"></i>
          </template>
          <template #on>
            <i class="bx bx-check"></i>
          </template>
        </vs-switch>
      </SwitchInput>
    </div>
    <div class="flex" v-if="form.type === SchemaType.numeric || form.type === SchemaType.string">
      <validation-provider v-slot="{ errors }">
        <vs-input
          v-model="form.min"
          default="0"
          type="number"
          :label="form.type === SchemaType.numeric ? 'Minimalna wartość' : 'Minimalna długość'"
        >
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <validation-provider v-slot="{ errors }">
        <vs-input
          v-model="form.max"
          type="number"
          :label="form.type === SchemaType.numeric ? 'Maksymalna wartość' : 'Maksymalna długość'"
        >
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <validation-provider v-slot="{ errors }" v-if="form.type === SchemaType.numeric">
        <vs-input v-model="form.step" type="number" label="Krok">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
    </div>
    <validation-provider v-slot="{ errors }" v-if="form.type !== SchemaType.select">
      <vs-input v-model="form.default" type="number" label="Wartość domyślna">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <br />
    <div class="danger-zone">
      <span class="danger-zone__title">Opcje zaawansowane</span>
      <validation-provider v-slot="{ errors }">
        <vs-input v-model="form.pattern" label="Wzór Regex">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <validation-provider v-slot="{ errors }">
        <vs-input v-model="form.validation" label="Zaawansowana walidacja">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
    </div>
    <br />
    <vs-button color="dark" size="large" @click="handleSubmit(submit)">
      Zapisz
    </vs-button>
  </validation-observer>
</template>

<script>
import clone from 'lodash/clone'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import SwitchInput from '@/components/SwitchInput.vue'
import { SchemaType, SchemaTypeLabel } from '@/interfaces/SchemaType'

const CLEAR_FORM = {
  name: '',
  type: SchemaType.string,
  description: '',
  price: 0,
  hidden: false,
  required: false,
  min: 0,
  max: 0,
  step: 0.1,
  default: '',
  pattern: '',
  validation: '',
  options: [],
}

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    SwitchInput,
  },
  data: () => ({
    form: { ...CLEAR_FORM },
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
    },
  },
  methods: {
    async submit() {
      const loading = this.$vs.loading({ color: '#000' })
      let id = null

      if (!this.form?.id) {
        const { id: newID } = await this.$store.dispatch('schemas/add', this.form)
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
          item: this.form,
        })
        if (success) {
          id = this.form.id
          this.$vs.notification({
            color: 'success',
            title: 'Schemat został zaktualizowany.',
          })
        }
      }
      loading.close()
      this.$emit('submit', this.$store.getters['schemas/getFromListById'](id))
    },
  },
  mounted() {
    this.form = this.schema.type ? clone(this.schema) : { ...CLEAR_FORM }
  },
}
</script>

<style lang="scss" scoped>
.schema-form {
  .danger-zone {
    &__title {
      font-family: $font-sec;
      color: #f54758;
    }

    padding: 12px;
    border-radius: 12px;
    border: solid 1px #f54758;
  }

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

  .vs-select__label {
    padding-left: 8px;
  }
}
</style>
