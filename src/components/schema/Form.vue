<template>
  <validation-observer v-slot="{ handleSubmit }">
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
            v-for="type in Object.values(TYPE)"
            :key="type"
            :label="TYPE_LABEL[type]"
            :value="type"
          >
            {{ TYPE_LABEL[type] }}
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
    <div class="flex" v-if="form.type === TYPE.numeric || form.type === TYPE.string">
      <validation-provider v-slot="{ errors }">
        <vs-input
          v-model="form.min"
          default="0"
          type="number"
          :label="form.type === TYPE.numeric ? 'Minimalna wartość' : 'Minimalna długość'"
        >
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <validation-provider v-slot="{ errors }">
        <vs-input
          v-model="form.max"
          type="number"
          :label="form.type === TYPE.numeric ? 'Maksymalna wartość' : 'Maksymalna długość'"
        >
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <validation-provider v-slot="{ errors }" v-if="form.type === TYPE.numeric">
        <vs-input v-model="form.step" type="number" label="Krok">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
    </div>
    <validation-provider v-slot="{ errors }" v-if="form.type !== TYPE.select">
      <vs-input v-model="form.default" type="number" label="Wartość domyślna">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <br />
    <vs-alert color="warn" shadow>
      <template #title>
        Opcje zaawansowane
      </template>
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
    </vs-alert>
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

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    SwitchInput,
  },
  data: () => ({
    form: {
      name: '',
      type: SchemaType.string,
      description: '',
      price: 0,
      hidden: false,
      required: false,
      min: 0,
      max: 0,
      step: 1,
      default: '',
      pattern: '',
      validation: '',
      options: [],
    },
    TYPE: Object.freeze(SchemaType),
    TYPE_LABEL: Object.freeze(SchemaTypeLabel),
  }),
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
  watch: {
    schema(s) {
      this.form = clone(s)
    },
  },
  methods: {
    async submit() {
      const loading = this.$vs.loading({ color: '#000' })
      if (!this.form?.id) {
        const { id: newID } = await this.$store.dispatch('schemas/add', this.form)
        if (newID) {
          this.$vs.notification({
            color: 'success',
            title: 'Schemat został utworzony.',
          })
          this.$router.push(`/schemas/${newID}`)
        }
      } else {
        const success = await this.$store.dispatch('schemas/update', {
          id: this.form.id,
          item: this.form,
        })
        if (success) {
          this.$vs.notification({
            color: 'success',
            title: 'Schemat został zaktualizowany.',
          })
        }
      }
      loading.close()
      this.$emit('submit')
    },
  },
}
</script>

<style lang="scss">
.vs-input-parent {
  margin-top: 24px;
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
</style>
