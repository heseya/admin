<template>
  <validation-observer v-slot="{ handleSubmit }" class="schema-form">
    <validation-provider rules="required" v-slot="{ errors }">
      <vs-input v-model="form.name" label="Nazwa">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <validation-provider v-slot="{ errors }">
      <vs-input v-model="form.description" label="Opis">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <div class="flex">
      <validation-provider rules="id-required" v-slot="{ errors }">
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
      <validation-provider rules="required|not-negative" v-slot="{ errors }">
        <vs-input v-model="form.price" label="Dodatkowa cena">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
    </div>
    <div class="flex">
      <SwitchInput v-model="form.hidden">
        <template #title>Ukryty</template>
      </SwitchInput>
      <SwitchInput v-model="form.required">
        <template #title>Wymagany</template>
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
    <validation-provider
      v-slot="{ errors }"
      v-if="form.type === SchemaType.numeric || form.type === SchemaType.string"
    >
      <vs-input
        v-model="form.default"
        :type="form.type === SchemaType.numeric ? 'number' : 'text'"
        label="Wartość domyślna"
      >
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <SwitchInput v-if="form.type === SchemaType.boolean" v-model="form.default">
      <template #title>Wartość domyślna</template>
    </SwitchInput>

    <br />
    <Zone v-if="form.type === SchemaType.select">
      <template #title>
        Opcje do wyboru
        <vs-button size="small" transparent @click.stop="addOption">
          <i class="bx bx-plus"></i> Dodaj
        </vs-button>
      </template>

      <div class="schema-form__option" v-for="(option, i) in form.options" :key="option + i">
        <validation-provider class="input" v-slot="{ errors }" rules="required">
          <vs-input v-model="option.name" label="Nazwa">
            <template #message-danger>{{ errors[0] }}</template>
          </vs-input>
        </validation-provider>
        <vs-input v-model="option.price" type="number" label="Cena"></vs-input>
        <Autocomplete
          class="input"
          type="products"
          label="Przedmioty z magazynu"
          v-model="form.options[i].items"
        />
        <SwitchInput v-model="option.disabled">
          <template #title>Disabled</template>
        </SwitchInput>
        <vs-radio v-model="defaultOption" :val="i" dark>
          Domyślny
        </vs-radio>
        <vs-button
          size="small"
          danger
          icon
          @click.stop="removeOption(i)"
          :disabled="form.options.length === 1"
        >
          <i class="bx bx-trash"></i>
        </vs-button>
      </div>
      <vs-button size="small" transparent @click.stop="addOption">
        <i class="bx bx-plus"></i> Dodaj
      </vs-button>
    </Zone>

    <br />

    <Zone title="Opcje zaawansowane" type="danger">
      <validation-provider v-slot="{ errors }">
        <vs-input v-model="form.pattern" label="Wyrażenie regularne">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <validation-provider v-slot="{ errors }">
        <vs-input v-model="form.validation" label="Walidacja">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
    </Zone>
    <br />
    <vs-button color="dark" size="large" @click.stop="handleSubmit(submit)">
      Zapisz
    </vs-button>
  </validation-observer>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import SwitchInput from '@/components/SwitchInput.vue'
import Autocomplete from '@/components/Autocomplete.vue'
import Zone from '@/components/Zone.vue'
import { SchemaType, SchemaTypeLabel } from '@/interfaces/SchemaType'

const CLEAR_OPTION = {
  name: '',
  default: false,
  disabled: false,
  price: 0,
  items: [],
}

const CLEAR_FORM = {
  name: '',
  type: SchemaType.select,
  description: '',
  price: 0,
  hidden: false,
  required: true,
  min: 0,
  max: 0,
  step: 0.1,
  default: '',
  pattern: '',
  validation: '',
  options: [cloneDeep(CLEAR_OPTION)],
}

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    SwitchInput,
    Autocomplete,
    Zone,
  },
  data: () => ({
    form: cloneDeep(CLEAR_FORM),
    defaultOption: 0,
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
  watch: {
    defaultOption(defaultOption) {
      this.form.options = this.form.options.map((v) => ({ ...v, default: false }))
      this.form.options[defaultOption].default = true
    },
    'form.type'(type) {
      if (type === SchemaType.select) this.form.options = [cloneDeep(CLEAR_OPTION)]
      else this.form.options = []
    },
  },
  methods: {
    addOption() {
      this.form.options.push(cloneDeep(CLEAR_OPTION))
    },
    removeOption(index) {
      this.form.options = this.form.options.filter((_, i) => i !== index)
    },
    async submit() {
      const loading = this.$vs.loading({ color: '#000' })
      let id = null

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
      loading.close()
      this.$emit('submit', this.$store.getters['schemas/getFromListById'](id))
    },
  },
  created() {
    this.form = this.schema.type ? cloneDeep(this.schema) : cloneDeep(CLEAR_FORM)
  },
}
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

  &__option {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 100px 1fr 64px 64px 64px;
    align-items: center;
    justify-items: center;

    .input {
      width: 100%;
    }

    .vs-radio-content {
      flex-direction: column;
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

  .vs-radio__label {
    font-size: 0.6em;
  }

  .vs-select__label {
    padding-left: 8px;
  }
}
</style>
